import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { clsx } from "clsx";

interface DataPoint {
  time: string;
  value: number;
}

interface MarketChartProps {
  data: DataPoint[];
  pair: string;
  isPositive: boolean;
}

export function MarketChart({ data, pair, isPositive }: MarketChartProps) {
  const color = isPositive ? "hsl(var(--primary))" : "hsl(var(--destructive))";

  return (
    <div className="w-full h-full bg-card/40 rounded-xl border border-border p-4 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-display font-bold text-muted-foreground tracking-wide">
          M5 CHART <span className="text-foreground ml-2">{pair}</span>
        </h3>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
