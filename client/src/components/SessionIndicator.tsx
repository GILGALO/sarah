import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export function SessionIndicator() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple session logic (approximate)
  const hour = time.getUTCHours();
  const isLondon = hour >= 7 && hour < 16;
  const isNewYork = hour >= 12 && hour < 21;
  const isTokyo = hour >= 0 && hour < 9;
  const isSydney = hour >= 21 || hour < 6;

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center bg-card/30 rounded-lg p-3 border border-border/50">
      <div className="flex items-center gap-2 text-primary font-mono text-sm px-3 border-r border-border/30 pr-4">
        <Clock className="w-4 h-4" />
        {format(time, "HH:mm:ss")} UTC
      </div>
      
      <div className="flex gap-2 text-xs font-bold tracking-wider">
        <SessionTag name="LONDON" active={isLondon} />
        <SessionTag name="NEW YORK" active={isNewYork} />
        <SessionTag name="TOKYO" active={isTokyo} />
        <SessionTag name="SYDNEY" active={isSydney} />
      </div>
    </div>
  );
}

function SessionTag({ name, active }: { name: string, active: boolean }) {
  return (
    <div className={`px-2 py-1 rounded transition-colors duration-300 ${
      active 
        ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.2)]" 
        : "bg-muted text-muted-foreground opacity-40"
    }`}>
      {name}
    </div>
  );
}
