import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client using AI Integrations credentials
const openai = new OpenAI({ 
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
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

  // Generate a new signal (AI Analysis)
  app.post(api.signals.create.path, async (req, res) => {
    try {
      const { pair } = api.signals.create.input.parse(req.body);
      
      // Prompt OpenAI to analyze and generate a signal
      // We will provide it with some "mock" technical indicators context
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert forex trading AI. Analyze the ${pair} market for a 5-minute (M5) trade. 
            Generate a signal JSON with the following fields: 
            - action: "BUY/CALL" or "SELL/PUT"
            - confidence: number between 70 and 99
            - analysis: brief technical reason (e.g., "RSI divergence at support level")
            
            Current Time: ${new Date().toLocaleTimeString()}
            Assume standard market session behavior.`
          },
        ],
        response_format: { type: "json_object" }
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Calculate times
      const now = new Date();
      // Round UP to the next 5-minute interval
      const minutes = now.getMinutes();
      const roundedMinutes = Math.ceil((minutes + 1) / 5) * 5;
      
      const startTimeDate = new Date(now);
      startTimeDate.setMinutes(roundedMinutes);
      startTimeDate.setSeconds(0);
      startTimeDate.setMilliseconds(0);
      
      const endTimeDate = new Date(startTimeDate.getTime() + 5 * 60000); // +5 mins from start

      const startTime = startTimeDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const endTime = endTimeDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const newSignal = await storage.createSignal({
        pair,
        action: aiResponse.action || "BUY/CALL",
        confidence: aiResponse.confidence || 85,
        startTime: `${startTime} UTC`,
        endTime: `${endTime} UTC`,
        status: "active",
        analysis: aiResponse.analysis || "Market trend analysis",
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
