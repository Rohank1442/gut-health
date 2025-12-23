/**
 * List of food entries with loading and empty states
 */

import { FoodEntry } from "@/lib/api";
import { FoodEntryItem } from "@/components/FoodEntryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FoodEntryListProps {
  entries: FoodEntry[];
  isLoading?: boolean;
  onEdit: (entry: FoodEntry) => void;
  onDelete: (entryId: string) => void;
}

export function FoodEntryList({ entries, isLoading, onEdit, onDelete }: FoodEntryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-1">
          No food logged yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start tracking your meals to get personalized gut health insights and tips.
        </p>
      </motion.div>
    );
  }

  // Group entries by meal type
  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];
  const sortedEntries = [...entries].sort((a, b) => {
    return mealOrder.indexOf(a.meal_type) - mealOrder.indexOf(b.meal_type);
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedEntries.map((entry) => (
          <FoodEntryItem
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}