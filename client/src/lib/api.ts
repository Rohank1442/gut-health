/**
 * API client for Gut Health Tracker (FastAPI backend)
 */

import { supabase } from "@/integrations/supabase/client";

const API_BASE = import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// -------------------------
// Auth headers helper
// -------------------------
async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("User not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

// -------------------------
// Types
// -------------------------
export interface FoodEntry {
  id: string;
  time?: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  food_text: string;
}

export interface FoodEntryListResponse {
  date: string;
  entries: FoodEntry[];
}

export interface DailySummaryStats {
  fiber_grams: number;
  fiber_score: number;
  diversity_score: number;
  processed_score: number;
  probiotic_score: number;
  digestive_score: number;
}

export interface DailySummaryResponse {
  date: string;
  gut_score: number;
  stats: DailySummaryStats;
  status: string;
}

export interface WeeklySummaryResponse {
  average_gut_score: number;
  best_day: string | null;
  worst_day: string | null;
  fiber_trend: "improving" | "stable" | "declining";
  processed_trend: "improving" | "stable" | "declining";
  start_date: string;
  end_date: string;
  trend: "improving" | "stable" | "declining"; 
  daily_scores: { date: string; gut_score: number }[]; 
}

export interface TipsLogResponse {
  date: string;
  tips: string[];
}

// -------------------------
// Food Entry APIs
// -------------------------
export async function getFoodEntries(date: string): Promise<FoodEntryListResponse> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/food-entry?date=${date}`, { headers });
    if (res.status === 404) return { date, entries: [] };
    if (!res.ok) throw new Error(`Failed to fetch food entries: ${res.status}`);
    return res.json();
  } catch (err: any) {
    console.error("getFoodEntries error:", err);
    return { date, entries: [] };
  }
}

export async function addFoodEntry(entry: {
  date: string;
  meal_type: string;
  food_text: string;
}): Promise<{
  message: string;
  entry_id: string;
  updated_gut_score: number;
  status: string;
}> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/food-entry`, {
      method: "POST",
      headers,
      body: JSON.stringify(entry),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to add food entry: ${res.status}`);
    }
    return res.json();
  } catch (err: any) {
    console.error("addFoodEntry error:", err);
    throw err;
  }
}

export async function updateFoodEntry(entryId: string, data: { food_text: string }) {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/food-entry/${entryId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to update entry: ${res.status}`);
    }
    return res.json();
  } catch (err: any) {
    console.error("updateFoodEntry error:", err);
    throw err;
  }
}

export async function deleteFoodEntry(entryId: string) {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/food-entry/${entryId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to delete entry: ${res.status}`);
    }
  } catch (err: any) {
    console.error("deleteFoodEntry error:", err);
    throw err;
  }
}

// -------------------------
// Daily Summary APIs
// -------------------------
export async function getDailySummary(date: string): Promise<DailySummaryResponse | null> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/daily-summary?date=${date}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch daily summary: ${res.status}`);
    return res.json();
  } catch (err: any) {
    console.error("getDailySummary error:", err);
    return null;
  }
}

export async function getWeeklySummary(startDate: string): Promise<WeeklySummaryResponse | null> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/weekly-summary?start=${startDate}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch weekly summary: ${res.status}`);
    return res.json();
  } catch (err: any) {
    console.error("getWeeklySummary error:", err);
    return null;
  }
}

// -------------------------
// Tips APIs
// -------------------------
export async function generateTips(date: string): Promise<TipsLogResponse> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/tips/generate?date=${date}`, { method: "POST", headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to generate tips: ${res.status}`);
    }
    return res.json();
  } catch (err: any) {
    console.error("generateTips error:", err);
    throw err;
  }
}

export async function getTips(date: string): Promise<TipsLogResponse | null> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE}/tips?date=${date}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch tips: ${res.status}`);
    return res.json();
  } catch (err: any) {
    console.error("getTips error:", err);
    return null;
  }
}

// -------------------------
// Date utils
// -------------------------
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}