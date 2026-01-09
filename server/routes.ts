import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

// Initialize AI clients using AI Integrations credentials
const openai = new OpenAI({ 
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
});

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all signals
  app.get(api.signals.list.path, async (req, res) => {
    const signals = await storage.getSignals();
    res.json(signals);
  });

  // Get latest signal
  app.get(api.signals.latest.path, async (req, res) => {
    const signal = await storage.getLatestSignal();
    res.json(signal || null);
  });

  // Generate a new signal (Triple-AI Verification Analysis)
  app.post(api.signals.create.path, async (req, res) => {
    try {
      const { pair } = api.signals.create.input.parse(req.body);
      
      const prompt = `You are an expert forex trading AI. Analyze the ${pair} market for a 5-minute (M5) trade. 
      Generate a signal JSON with:
      - action: "BUY/CALL" or "SELL/PUT"
      - confidence: number between 70 and 99
      - analysis: brief technical reason (e.g., "RSI divergence at support level")
      
      Current Time: ${new Date().toLocaleTimeString()}
      Return only the JSON object.`;

      // 1. OpenAI (GPT-4o)
      const gptTask = openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" }
      }).then(res => JSON.parse(res.choices[0].message.content || "{}"));

      // 2. Anthropic (Claude 3.5 Sonnet)
      const claudeTask = anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }).then(res => {
        const text = res.content[0].type === 'text' ? res.content[0].text : '{}';
        try {
          // Extract JSON if it's wrapped in text
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          return JSON.parse(jsonMatch ? jsonMatch[0] : text);
        } catch (e) { return {}; }
      });

      // 3. Gemini (Flash)
      const geminiTask = gemini.getGenerativeModel({ model: "gemini-3-flash-preview" })
        .generateContent(prompt)
        .then(res => {
          const text = res.response.text();
          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : text);
          } catch (e) { return {}; }
        });

      // Run all AI analyses in parallel
      const [gptRes, claudeRes, geminiRes] = await Promise.all([gptTask, claudeTask, geminiTask]);

      // Consensus logic
      const results = [
        { model: 'OpenAI', ...gptRes },
        { model: 'Anthropic', ...claudeRes },
        { model: 'Gemini', ...geminiRes }
      ];

      const buys = results.filter(r => r.action?.includes('BUY') || r.action?.includes('CALL'));
      const sells = results.filter(r => r.action?.includes('SELL') || r.action?.includes('PUT'));

      let finalAction, verifiers;
      if (buys.length >= 2) {
        finalAction = "BUY/CALL";
        verifiers = buys.map(b => b.model);
      } else if (sells.length >= 2) {
        finalAction = "SELL/PUT";
        verifiers = sells.map(s => s.model);
      } else {
        // Fallback to highest confidence if no consensus
        const best = results.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0];
        finalAction = best.action || "BUY/CALL";
        verifiers = [best.model];
      }

      const avgConfidence = Math.round(results.reduce((acc, r) => acc + (r.confidence || 0), 0) / results.length);
      const combinedAnalysis = results.map(r => `${r.model}: ${r.analysis}`).join(" | ");
      
      // Calculate times
      const now = new Date();
      const roundedMinutes = Math.ceil((now.getMinutes() + 1) / 5) * 5;
      const startTimeDate = new Date(now);
      startTimeDate.setMinutes(roundedMinutes, 0, 0);
      const endTimeDate = new Date(startTimeDate.getTime() + 5 * 60000);

      const startTime = startTimeDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const endTime = endTimeDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const newSignal = await storage.createSignal({
        pair,
        action: finalAction,
        confidence: avgConfidence,
        startTime: `${startTime} UTC`,
        endTime: `${endTime} UTC`,
        status: "active",
        analysis: combinedAnalysis,
        verifiers: verifiers,
      });

      res.status(201).json(newSignal);
    } catch (error) {
      console.error("Signal generation error:", error);
      res.status(500).json({ message: "Failed to generate signal" });
    }
  });

  // Clear all signals
  app.delete(api.signals.list.path, async (req, res) => {
    try {
      await storage.clearSignals();
      res.status(204).send();
    } catch (error) {
      console.error("Clear signals error:", error);
      res.status(500).json({ message: "Failed to clear signals" });
    }
  });

  // Mock Market Data for Chart
  app.get(api.market.data.path, (req, res) => {
    const { pair } = req.params;
    // Generate 20 data points of simulated price movement
    const data = [];
    let price = 100.00;
    const now = new Date();
    
    for (let i = 20; i > 0; i--) {
      price = price + (Math.random() - 0.5) * 0.5;
      data.push({
        time: new Date(now.getTime() - i * 5 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        value: Number(price.toFixed(4))
      });
    }
    
    res.json(data);
  });

  return httpServer;
}
