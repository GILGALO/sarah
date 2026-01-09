import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity, Clock, Target } from "lucide-react";
import { clsx } from "clsx";
import type { Signal } from "@shared/schema";
import { SocialShare } from "./SocialShare";

interface SignalCardProps {
  signal: Signal | null | undefined;
  isLoading: boolean;
}

export function SignalCard({ signal, isLoading }: SignalCardProps) {
  if (isLoading) {
    return (
      <div className="w-full h-80 rounded-2xl bg-card/50 border border-border/50 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Activity className="w-8 h-8 animate-spin" />
          <span className="font-mono text-sm">ANALYZING MARKET DATA...</span>
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="w-full h-80 rounded-2xl bg-card/50 border border-border/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Activity className="w-12 h-12 opacity-20" />
          <span className="font-mono">NO ACTIVE SIGNAL</span>
        </div>
      </div>
    );
  }

  const isBuy = signal.action === "BUY" || signal.action === "CALL";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      key={signal.id}
      className={clsx(
        "relative w-full overflow-hidden rounded-2xl bg-card border cyber-border shadow-lg transition-all duration-300",
        isBuy ? "border-primary/30 shadow-primary/10" : "border-destructive/30 shadow-destructive/10"
      )}
    >
      {/* Background glow effect */}
      <div className={clsx(
        "absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -z-10",
        isBuy ? "bg-primary" : "bg-destructive"
      )} />

      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border">
                M5 Signal
              </span>
              <span className={clsx(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border animate-pulse",
                isBuy ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                Live
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              {signal.pair}
            </h2>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground font-mono mb-1">CONFIDENCE</span>
            <div className="flex items-center gap-2">
              <span className={clsx(
                "text-2xl font-bold font-mono",
                isBuy ? "text-primary" : "text-destructive"
              )}>
                {signal.confidence}%
              </span>
              <Target className={clsx("w-5 h-5", isBuy ? "text-primary" : "text-destructive")} />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border/50" />

        {/* Action Display */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Action</span>
            <div className={clsx(
              "flex items-center gap-3 text-4xl md:text-5xl font-black tracking-tighter",
              isBuy ? "text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "text-destructive drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            )}>
              {isBuy ? <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16" /> : <ArrowDownRight className="w-12 h-12 md:w-16 md:h-16" />}
              {signal.action}
            </div>
          </div>

          <div className="text-right space-y-3">
            <div className="flex items-center justify-end gap-3 text-sm md:text-base">
              <span className="text-muted-foreground">Start:</span>
              <span className="font-mono font-medium bg-background/50 px-2 py-1 rounded border border-border">
                {signal.startTime}
              </span>
            </div>
            <div className="flex items-center justify-end gap-3 text-sm md:text-base">
              <span className="text-muted-foreground">End:</span>
              <span className="font-mono font-medium bg-background/50 px-2 py-1 rounded border border-border">
                {signal.endTime}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${signal.confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={clsx(
              "absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_currentColor]",
              isBuy ? "bg-primary text-primary" : "bg-destructive text-destructive"
            )}
          />
        </div>

        {/* Verifiers info */}
        {signal.verifiers && Array.isArray(signal.verifiers) && signal.verifiers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(signal.verifiers as string[]).map((v) => (
              <span key={v} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20 font-mono uppercase">
                {v} Verified
              </span>
            ))}
          </div>
        )}
        
        {/* Analysis Text */}

        <div className="mt-4 p-4 rounded-lg bg-background/40 border border-border/50 text-sm text-muted-foreground font-mono">
           <span className="text-primary mr-2">AI_ANALYSIS:</span> 
           {signal.analysis}
        </div>

        <SocialShare signal={signal} />
      </div>
    </motion.div>
  );
}
