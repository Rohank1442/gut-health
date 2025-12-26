/**
 * Weekly summary page showing gut score trends over time
 */

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { WeeklySummaryChart } from "@/components/WeeklySummaryChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getWeeklySummary, formatDate, formatDisplayDate } from "@/lib/api";
import { ChevronLeft, ChevronRight, Loader2, Target, TrendingUp, Award } from "lucide-react";
import { subDays, addDays, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WeeklySummary() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Start of current week (Monday)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekStartStr = formatDate(weekStart);

  // ALL hooks must be called before any conditional returns
  // Fetch weekly summary
  const { 
    data: weeklySummary, 
    isLoading 
  } = useQuery({
    queryKey: ["weeklySummary", weekStartStr],
    queryFn: () => getWeeklySummary(weekStartStr),
    enabled: isAuthenticated,
  });

  const goToPreviousWeek = () => setWeekStart(subDays(weekStart, 7));
  const goToNextWeek = () => setWeekStart(addDays(weekStart, 7));
  const goToCurrentWeek = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const isCurrentWeek = formatDate(startOfWeek(new Date(), { weekStartsOn: 1 })) === weekStartStr;

  // Calculate stats for cards
  const bestDay = weeklySummary?.daily_scores.reduce((best, day) => 
    day.gut_score > (best?.gut_score || 0) ? day : best
  , weeklySummary.daily_scores[0]);

  const daysTracked = weeklySummary?.daily_scores.filter(d => d.gut_score > 0).length || 0;

  // Conditional returns AFTER all hooks
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Header with week navigation */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">Weekly Trends</h1>
            <p className="text-muted-foreground">See how your gut health is evolving</p>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="min-w-[200px]">
              Week of {formatDisplayDate(weekStartStr)}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextWeek}
              disabled={isCurrentWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {!isCurrentWeek && (
              <Button variant="soft" size="sm" onClick={goToCurrentWeek} className="ml-2">
                This Week
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        {weeklySummary && (
          <motion.div 
            className="grid sm:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Average Score */}
            <Card className="p-6 gradient-card border-border/50 shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Average</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {Math.round(weeklySummary.average_gut_score)}  
                  </p>
                </div>
              </div>
            </Card>

            {/* Best Day */}
            <Card className="p-6 gradient-card border-border/50 shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Day</p>
                  <p className="font-display text-2xl font-bold text-success">
                    {bestDay?.gut_score || 0}
                  </p>
                  {bestDay && (
                    <p className="text-xs text-muted-foreground">
                      {formatDisplayDate(bestDay.date)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Days Tracked */}
            <Card className="p-6 gradient-card border-border/50 shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Tracked</p>
                  <p className="font-display text-2xl font-bold text-accent">
                    {daysTracked}/7
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WeeklySummaryChart data={weeklySummary} isLoading={isLoading} />
        </motion.div>

        {/* Daily Breakdown */}
        {weeklySummary && weeklySummary.daily_scores.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-xl font-semibold mb-4">Daily Breakdown</h2>
            <div className="grid sm:grid-cols-7 gap-3">
              {weeklySummary.daily_scores.map((day) => {
                const getScoreColor = () => {
                  if (day.gut_score >= 80) return "bg-success/10 border-success/30 text-success";
                  if (day.gut_score >= 60) return "bg-primary/10 border-primary/30 text-primary";
                  if (day.gut_score >= 40) return "bg-warning/10 border-warning/30 text-warning";
                  if (day.gut_score > 0) return "bg-destructive/10 border-destructive/30 text-destructive";
                  return "bg-muted border-border text-muted-foreground";
                };

                return (
                  <Card 
                    key={day.date}
                    className={cn(
                      "p-4 text-center border-2 transition-all hover:shadow-sm",
                      getScoreColor()
                    )}
                  >
                    <p className="text-xs font-medium mb-2 opacity-70">
                      {formatDisplayDate(day.date).split(",")[0]}
                    </p>
                    <p className="font-display text-2xl font-bold">
                      {day.gut_score > 0 ? day.gut_score : "—"}
                    </p>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}