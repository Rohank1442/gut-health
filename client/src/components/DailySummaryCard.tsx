/**
 * Card displaying daily gut health summary with stats
 */

import { Card } from "@/components/ui/card";
import { GutScoreCircle } from "@/components/GutScoreCircle";
import { DailySummaryStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Apple, Sparkles, Beaker, Salad, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DailySummaryCardProps {
  gutScore: number;
  stats: DailySummaryStats;
  status: string;
  isLoading?: boolean;
}

export function DailySummaryCard({ gutScore, stats, status, isLoading }: DailySummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 gradient-card border-border/50 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const statItems = [
    { 
      label: "Fiber", 
      value: `${stats.fiber_grams}g`, 
      score: stats.fiber_score,
      icon: Leaf,
    },
    { 
      label: "Diversity", 
      value: stats.diversity_score, 
      score: stats.diversity_score,
      icon: Sparkles,
    },
    { 
      label: "Whole Foods", 
      value: stats.processed_score, 
      score: stats.processed_score,
      icon: Apple,
    },
    { 
      label: "Probiotics", 
      value: stats.probiotic_score, 
      score: stats.probiotic_score,
      icon: Beaker,
    },
    { 
      label: "Digestive", 
      value: stats.digestive_score, 
      score: stats.digestive_score,
      icon: Salad,
    },
    { 
      label: "Overall", 
      value: status, 
      score: gutScore,
      icon: Activity,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success bg-success/10";
    if (score >= 60) return "text-primary bg-primary/10";
    if (score >= 40) return "text-warning bg-warning/10";
    return "text-destructive bg-destructive/10";
  };

  return (
    <Card className="p-6 gradient-card border-border/50 shadow-md overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Gut Score Circle */}
        <motion.div 
          className="shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GutScoreCircle score={gutScore} size="lg" />
        </motion.div>

        {/* Stats Grid */}
        <div className="flex-1 w-full">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Today's Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className={cn(
                    "rounded-xl p-4 transition-all hover:shadow-sm",
                    getScoreColor(item.score)
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <div className="text-lg font-display font-semibold">
                    {typeof item.value === "number" ? `${item.value}%` : item.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}