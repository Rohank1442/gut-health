/**
 * Individual food entry display with edit/delete actions
 */

import { FoodEntry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Coffee, Sun, Moon, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FoodEntryItemProps {
  entry: FoodEntry;
  onEdit: (entry: FoodEntry) => void;
  onDelete: (entryId: string) => void;
}

export function FoodEntryItem({ entry, onEdit, onDelete }: FoodEntryItemProps) {
  const mealTypeConfig = {
    breakfast: { 
      icon: Coffee, 
      label: "Breakfast", 
      color: "text-warning bg-warning/10 border-warning/20" 
    },
    lunch: { 
      icon: Sun, 
      label: "Lunch", 
      color: "text-primary bg-primary/10 border-primary/20" 
    },
    dinner: { 
      icon: Moon, 
      label: "Dinner", 
      color: "text-info bg-info/10 border-info/20" 
    },
    snack: { 
      icon: Cookie, 
      label: "Snack", 
      color: "text-accent bg-accent/10 border-accent/20" 
    },
  };

  const config = mealTypeConfig[entry.meal_type] || mealTypeConfig.snack;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "group flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-sm",
        config.color
      )}
    >
      {/* Meal type icon */}
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium uppercase tracking-wide opacity-80">
            {config.label}
          </span>
          {entry.time && (
            <span className="text-xs opacity-60">
              • {entry.time}
            </span>
          )}
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {entry.food_text}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(entry)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}