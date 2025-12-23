/**
 * Card displaying AI-generated gut health tips
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface TipsCardProps {
  tips: string[];
  isLoading?: boolean;
  isGenerating?: boolean;
  onGenerateTips: () => void;
}

export function TipsCard({ tips, isLoading, isGenerating, onGenerateTips }: TipsCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6 gradient-warm border-border/50 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 gradient-warm border-border/50 shadow-md overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Daily Tips</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights</p>
          </div>
        </div>
        
        <Button
          variant="soft"
          size="sm"
          onClick={onGenerateTips}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Tips
            </>
          )}
        </Button>
      </div>

      {tips.length === 0 ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-muted-foreground mb-4">
            Log some food entries, then generate personalized tips based on your meals.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-background/60 p-4 border border-border/30"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex gap-3">
                <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}