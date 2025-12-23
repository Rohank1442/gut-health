/**
 * Dashboard page showing today's food entries, daily summary, and tips
 */

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { DatePicker } from "@/components/DatePicker";
import { DailySummaryCard } from "@/components/DailySummaryCard";
import { FoodEntryList } from "@/components/FoodEntryList";
import { TipsCard } from "@/components/TipsCard";
import { AddFoodEntryDialog } from "@/components/AddFoodEntryDialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  getFoodEntries,
  addFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  getDailySummary,
  getTips,
  generateTips,
  formatDate,
  FoodEntry,
} from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  
  const dateStr = formatDate(selectedDate);

  // ALL hooks must be called before any conditional returns
  // Fetch food entries for selected date
  const { 
    data: foodEntries = [], 
    isLoading: entriesLoading,
  } = useQuery({
    queryKey: ["foodEntries", dateStr],
    queryFn: () => getFoodEntries(dateStr),
    enabled: isAuthenticated,
    select: (data) => data.entries
  });

  // Fetch daily summary
  const { 
    data: dailySummary, 
    isLoading: summaryLoading 
  } = useQuery({
    queryKey: ["dailySummary", dateStr],
    queryFn: () => getDailySummary(dateStr),
    enabled: isAuthenticated,
  });

  // Fetch tips
  const { 
    data: tipsData, 
    isLoading: tipsLoading 
  } = useQuery({
    queryKey: ["tips", dateStr],
    queryFn: () => getTips(dateStr),
    enabled: isAuthenticated,
  });

  // Add food entry mutation
  const addEntryMutation = useMutation({
    mutationFn: (data: { meal_type: string; food_text: string }) =>
      addFoodEntry({ ...data, date: dateStr }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries", dateStr] });
      queryClient.invalidateQueries({ queryKey: ["dailySummary", dateStr] });
      toast({ title: "Food entry added!", description: "Your meal has been logged." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add food entry.", variant: "destructive" });
    },
  });

  // Update food entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: ({ id, food_text }: { id: string; food_text: string }) =>
      updateFoodEntry(id, { food_text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries", dateStr] });
      queryClient.invalidateQueries({ queryKey: ["dailySummary", dateStr] });
      toast({ title: "Entry updated!", description: "Your changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update entry.", variant: "destructive" });
    },
  });

  // Delete food entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: deleteFoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodEntries", dateStr] });
      queryClient.invalidateQueries({ queryKey: ["dailySummary", dateStr] });
      toast({ title: "Entry deleted", description: "The food entry has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete entry.", variant: "destructive" });
    },
  });

  // Generate tips mutation
  const generateTipsMutation = useMutation({
    mutationFn: () => generateTips(dateStr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tips", dateStr] });
      toast({ title: "Tips generated!", description: "Check out your personalized gut health tips." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate tips.", variant: "destructive" });
    },
  });

  const handleSubmitEntry = async (data: { meal_type: string; food_text: string }) => {
    if (editingEntry) {
      await updateEntryMutation.mutateAsync({ id: editingEntry.id, food_text: data.food_text });
    } else {
      await addEntryMutation.mutateAsync(data);
    }
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: FoodEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    deleteEntryMutation.mutate(entryId);
  };

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
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Track your meals and gut health</p>
          </div>
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Food entries and Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Summary */}
            {dailySummary ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <DailySummaryCard
                  gutScore={dailySummary.gut_score}
                  stats={dailySummary.stats}
                  status={dailySummary.status}
                  isLoading={summaryLoading}
                />
              </motion.div>
            ) : (
              <Card className="p-8 gradient-card border-border/50 shadow-md text-center">
                <h3 className="font-display text-lg font-semibold mb-2">
                  No summary yet
                </h3>
                <p className="text-muted-foreground">
                  Log some meals to see your daily gut health summary.
                </p>
              </Card>
            )}

            {/* Food Entries */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 gradient-card border-border/50 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold">Food Log</h2>
                    <p className="text-sm text-muted-foreground">
                      {foodEntries.length} {foodEntries.length === 1 ? "entry" : "entries"} today
                    </p>
                  </div>
                  <Button
                    variant="hero"
                    onClick={() => {
                      setEditingEntry(null);
                      setDialogOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Meal
                  </Button>
                </div>

                <FoodEntryList
                  entries={foodEntries}
                  isLoading={entriesLoading}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TipsCard
              tips={tipsData?.tips || []}
              isLoading={tipsLoading}
              isGenerating={generateTipsMutation.isPending}
              onGenerateTips={() => generateTipsMutation.mutate()}
            />
          </motion.div>
        </div>
      </main>

      {/* Add/Edit Food Entry Dialog */}
      <AddFoodEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitEntry}
        editingEntry={editingEntry}
        isSubmitting={addEntryMutation.isPending || updateEntryMutation.isPending}
      />
    </div>
  );
}
