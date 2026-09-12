"use server";

import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

export interface VisitData {
  id: string;
  path: string;
  created_at: string;
}

export interface VisitSummary {
  date: string;
  count: number;
}

export interface PathSummary {
  path: string;
  count: number;
}

export async function logVisit(path: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  try {
    const supabase = await createClient();

    // Ignore purely API or static routes to avoid noise
    if (
      !path.startsWith("/") ||
      path.length > 300 ||
      path.includes("?") ||
      path.startsWith("/admin") ||
      path.startsWith("/auth") ||
      path.startsWith("/api") ||
      path.startsWith("/_next") ||
      path.includes(".")
    ) {
      return;
    }

    // Try to insert visit into 'site_visits' table
    const { error } = await supabase.from("site_visits").insert([
      {
        path,
        created_at: new Date().toISOString(),
      },
    ]);

    // Intentionally swallow errors so the app doesn't break if the table is missing
    if (error) {
      console.warn(
        "Failed to log visit (table might not exist yet):",
        error.message,
      );
    }
  } catch (err) {
    console.error("Error logging visit:", err);
  }
}

export async function getVisitsSummary() {
  const { supabase } = await requireAdmin();
  try {
    // Get visits from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("site_visits")
      .select("path, created_at")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return emptySummary();
    }

    // Aggregate data by date
    const dailyVisits: Record<string, number> = {};
    const pathVisits: Record<string, number> = {};

    data.forEach((visit) => {
      // Get YYYY-MM-DD
      const dateStr = new Date(visit.created_at).toISOString().split("T")[0];

      dailyVisits[dateStr] = (dailyVisits[dateStr] || 0) + 1;

      const p = visit.path || "/";
      pathVisits[p] = (pathVisits[p] || 0) + 1;
    });

    const summary: VisitSummary[] = Object.entries(dailyVisits)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topPaths: PathSummary[] = Object.entries(pathVisits)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 paths

    return {
      summary,
      topPaths,
      total: data.length,
    };
  } catch (err) {
    console.warn("Failed to fetch visits, no metrics available.", err);
    return emptySummary();
  }
}

function emptySummary() {
  return {
    summary: [] as VisitSummary[],
    topPaths: [] as PathSummary[],
    total: 0,
  };
}
