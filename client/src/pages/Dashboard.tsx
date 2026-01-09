import { useState } from "react";
import { useSignals, useLatestSignal, useGenerateSignal, useMarketData, useClearSignals } from "@/hooks/use-signals";
import { SignalCard } from "@/components/SignalCard";
import { MarketChart } from "@/components/MarketChart";
import { SessionIndicator } from "@/components/SessionIndicator";
import { HistoryTable } from "@/components/HistoryTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Zap, Activity, RefreshCw, Cpu, Trash2 } from "lucide-react";
import { clsx } from "clsx";

const PAIRS = ["AUD/JPY", "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"];

export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState("AUD/JPY");
  const [autoTrading, setAutoTrading] = useState(false);
  
  const { data: latestSignal, isLoading: isLoadingLatest } = useLatestSignal();
  const { data: signals } = useSignals();
  const { data: marketData } = useMarketData(selectedPair);
  const { mutate: generateSignal, isPending: isGenerating } = useGenerateSignal();
  const { mutate: clearSignals, isPending: isClearing } = useClearSignals();

  const handleGenerateSignal = () => {
    generateSignal({ pair: selectedPair });
  };

  const handleClearSignals = () => {
    if (confirm("Are you sure you want to clear all signal history?")) {
      clearSignals();
    }
  };

  const isPositiveTrend = latestSignal 
    ? (latestSignal.action === "BUY" || latestSignal.action === "CALL") 
    : true;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans scanline">
      {/* Top Navigation / Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display font-bold text-xl tracking-wider text-glow">
              GILGALO<span className="text-primary">-TRADER</span> AI
            </h1>
          </div>
          
          <SessionIndicator />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls & Signal Card (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Control Panel */}
            <div className="bg-card/30 border border-border p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger className="w-[180px] bg-background border-border font-mono font-medium">
                    <SelectValue placeholder="Select Pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAIRS.map(pair => (
                      <SelectItem key={pair} value={pair} className="font-mono">
                        {pair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="h-8 w-px bg-border hidden sm:block" />
                
                <div className="flex items-center gap-2">
                  <span className={clsx("text-xs font-bold uppercase", autoTrading ? "text-primary text-glow" : "text-muted-foreground")}>
                    Auto-AI
                  </span>
                  <Switch 
                    checked={autoTrading} 
                    onCheckedChange={setAutoTrading}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerateSignal}
                disabled={isGenerating}
                className={clsx(
                  "w-full sm:w-auto min-w-[160px] h-10 font-bold tracking-wide relative overflow-hidden transition-all duration-300",
                  "bg-accent hover:bg-accent/80 text-white shadow-[0_0_20px_rgba(var(--accent),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent),0.5)] border border-accent-foreground/20"
                )}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ANALYZING...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>GENERATE SIGNAL</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Main Signal Display */}
            <SignalCard signal={latestSignal} isLoading={isLoadingLatest} />
            
            {/* Quick Stats Grid - Decorative mostly */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Win Rate", value: "87%", color: "text-primary" },
                { label: "Active", value: "1,240", color: "text-foreground" },
                { label: "AI Model", value: "GPT-4o", color: "text-accent" },
                { label: "Latency", value: "12ms", color: "text-muted-foreground" },
              ].map((stat, i) => (
                <div key={i} className="bg-card/20 border border-border/50 p-3 rounded-lg text-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className={`font-mono font-bold text-lg ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Chart & History (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col h-full">
            
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSignals}
                disabled={isClearing || !signals || signals.length === 0}
                className="text-muted-foreground hover:text-destructive flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </Button>
            </div>

            {/* Chart Area */}
            <div className="h-[300px] md:h-[350px]">
              {marketData && marketData.length > 0 ? (
                <MarketChart 
                  data={marketData} 
                  pair={selectedPair} 
                  isPositive={isPositiveTrend} 
                />
              ) : (
                <div className="w-full h-full bg-card/40 rounded-xl border border-border flex items-center justify-center text-muted-foreground animate-pulse">
                  Initializing Neural Link...
                </div>
              )}
            </div>

            {/* Recent Signals List */}
            <div className="flex-1">
              <HistoryTable signals={signals || []} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Status Bar */}
      <footer className="border-t border-border bg-card/50 py-2 px-4 text-[10px] font-mono text-muted-foreground flex justify-between items-center">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> SYSTEM ONLINE
          </span>
          <span>SERVER: US-EAST-1</span>
          <span>VERSION: 2.4.0-BETA</span>
        </div>
        <div className="hidden md:block opacity-50">
          POWERED BY OPENAI ANALYSIS ENGINE
        </div>
      </footer>
    </div>
  );
}
