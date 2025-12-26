/**
 * Weekly summary chart showing gut score trends
 */

import { Card } from "@/components/ui/card";
import { WeeklySummaryResponse, formatDisplayDate } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WeeklySummaryChartProps {
  data: WeeklySummaryResponse | null;
  isLoading?: boolean;
}

export function WeeklySummaryChart({ data, isLoading }: WeeklySummaryChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 gradient-card border-border/50 shadow-md">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6 gradient-card border-border/50 shadow-md">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">
            No weekly data yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Track your meals consistently to see your weekly gut health trends.
          </p>
        </div>
      </Card>
    );
  }

  const trendConfig = {
    improving: { icon: TrendingUp, label: "Improving", color: "text-success" },
    stable: { icon: Minus, label: "Stable", color: "text-primary" },
    declining: { icon: TrendingDown, label: "Declining", color: "text-destructive" },
  };

  const trend = trendConfig[data.trend] || trendConfig.stable;
  const TrendIcon = trend.icon;

  const chartData = data.daily_scores.map((day) => ({
    ...day,
    displayDate: formatDisplayDate(day.date),
  }));

  return (
    <Card className="p-6 gradient-card border-border/50 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-xl font-semibold">Weekly Trend</h3>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(data.start_date)} — {formatDisplayDate(data.end_date)}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Average Score */}
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="font-display text-2xl font-bold text-primary">
              {Math.round(data.average_gut_score)}
            </div>
          </div>
          
          {/* Trend */}
          <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", 
            trend.color === "text-success" && "bg-success/10",
            trend.color === "text-primary" && "bg-primary/10",
            trend.color === "text-destructive" && "bg-destructive/10"
          )}>
            <TrendIcon className={cn("h-5 w-5", trend.color)} />
            <span className={cn("font-medium", trend.color)}>{trend.label}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <motion.div 
        className="h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gutScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(145, 35%, 42%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(145, 35%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <ReferenceLine 
              y={data.average_gut_score} 
              stroke="hsl(var(--primary))" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "var(--shadow-md)",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="gut_score"
              stroke="hsl(145, 35%, 42%)"
              strokeWidth={3}
              fill="url(#gutScoreGradient)"
              dot={{ fill: "hsl(145, 35%, 42%)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(145, 35%, 42%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
}