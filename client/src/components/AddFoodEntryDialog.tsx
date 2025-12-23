/**
 * Dialog for adding or editing food entries
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FoodEntry } from "@/lib/api";
import { Coffee, Sun, Moon, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddFoodEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { meal_type: string; food_text: string }) => Promise<void>;
  editingEntry?: FoodEntry | null;
  isSubmitting?: boolean;
}

const mealTypes = [
  { value: "breakfast", label: "Breakfast", icon: Coffee },
  { value: "lunch", label: "Lunch", icon: Sun },
  { value: "dinner", label: "Dinner", icon: Moon },
  { value: "snack", label: "Snack", icon: Cookie },
];

export function AddFoodEntryDialog({
  open,
  onOpenChange,
  onSubmit,
  editingEntry,
  isSubmitting,
}: AddFoodEntryDialogProps) {
  const [mealType, setMealType] = useState("breakfast");
  const [foodText, setFoodText] = useState("");

  useEffect(() => {
    if (editingEntry) {
      setMealType(editingEntry.meal_type);
      setFoodText(editingEntry.food_text);
    } else {
      setMealType("breakfast");
      setFoodText("");
    }
  }, [editingEntry, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodText.trim()) return;
    
    await onSubmit({ meal_type: mealType, food_text: foodText.trim() });
    setFoodText("");
    onOpenChange(false);
  };

  const isEditing = !!editingEntry;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit Food Entry" : "Add Food Entry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meal Type Selection */}
          {!isEditing && (
            <div className="space-y-3">
              <Label>Meal Type</Label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = mealType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setMealType(type.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl p-3 border-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-transparent bg-muted hover:bg-muted/80 text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Food Description */}
          <div className="space-y-3">
            <Label htmlFor="food-text">What did you eat?</Label>
            <Textarea
              id="food-text"
              placeholder="e.g., Oatmeal with blueberries and honey, Greek yogurt on the side..."
              value={foodText}
              onChange={(e) => setFoodText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible for better gut health insights.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={!foodText.trim() || isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Entry" : "Add Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
