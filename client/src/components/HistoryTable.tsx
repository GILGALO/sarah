import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { clsx } from "clsx";
import type { Signal } from "@shared/schema";

export function HistoryTable({ signals }: { signals: Signal[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card/30">
      <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
        <h3 className="font-display font-bold text-sm tracking-wider text-muted-foreground">SIGNAL HISTORY</h3>
        <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 bg-background rounded border border-border">LAST 10 SIGNALS</span>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/20 sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="px-4 py-3 font-mono text-xs text-muted-foreground font-medium">TIME</th>
              <th className="px-4 py-3 font-mono text-xs text-muted-foreground font-medium">PAIR</th>
              <th className="px-4 py-3 font-mono text-xs text-muted-foreground font-medium">ACTION</th>
              <th className="px-4 py-3 font-mono text-xs text-muted-foreground font-medium text-right">CONF</th>
              <th className="px-4 py-3 font-mono text-xs text-muted-foreground font-medium text-right">RESULT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {signals.map((signal) => {
              const isBuy = signal.action === "BUY" || signal.action === "CALL";
              return (
                <tr key={signal.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(signal.createdAt!), "HH:mm")}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">
                    {signal.pair}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border",
                      isBuy ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                      {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {signal.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {signal.confidence}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {signal.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
            
            {signals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-xs font-mono">
                  NO SIGNAL HISTORY AVAILABLE
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
