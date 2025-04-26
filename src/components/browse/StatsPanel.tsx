import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import type { StatsResponseDTO } from "../../types";
import { Card, CardContent } from "../ui/card";

interface StatsViewModel extends StatsResponseDTO {
  rejected_count: number;
  manual_percent: number;
  ai_full_percent: number;
  ai_edited_percent: number;
  rejected_percent: number;
}

export interface StatsPanelRef {
  refresh: () => void;
}

const StatsPanel = forwardRef<StatsPanelRef>((_, ref) => {
  const [stats, setStats] = useState<StatsViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stats");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch statistics");
      }
      const data: StatsResponseDTO = await response.json();

      // Calculate derived statistics
      const total = data.manual_count + data.ai_full_count + data.ai_edited_count;
      const rejected_count = data.total_generated - (data.ai_full_count + data.ai_edited_count);

      setStats({
        ...data,
        rejected_count,
        manual_percent: total > 0 ? Math.round((data.manual_count / total) * 100) : 0,
        ai_full_percent: total > 0 ? Math.round((data.ai_full_count / total) * 100) : 0,
        ai_edited_percent: total > 0 ? Math.round((data.ai_edited_count / total) * 100) : 0,
        rejected_percent: data.total_generated > 0 ? Math.round((rejected_count / data.total_generated) * 100) : 0,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchStats,
  }));

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <div
              data-testid="loading-spinner"
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4" data-testid="stats-error">
            <p className="text-destructive">{error}</p>
            <button onClick={fetchStats} className="text-sm text-primary hover:underline">
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const statItems = [
    { label: "AI unedited", count: stats.ai_full_count, percent: stats.ai_full_percent, dataTestId: "ai-unedited" },
    { label: "AI edited", count: stats.ai_edited_count, percent: stats.ai_edited_percent, dataTestId: "ai-edited" },
    { label: "Manual", count: stats.manual_count, percent: stats.manual_percent, dataTestId: "manual" },
    { label: "AI rejected", count: stats.rejected_count, percent: stats.rejected_percent, dataTestId: "ai-rejected" },
  ];

  return (
    <Card className="min-h-[100px]" data-testid="stats-panel">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{item.label}</h3>
              <p className="text-2xl font-bold" data-testid={"stat-count-" + item.dataTestId}>
                {item.count}
              </p>
              <p className="text-sm text-muted-foreground" data-testid={"stat-percentage-" + item.dataTestId}>
                {item.percent}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

StatsPanel.displayName = "StatsPanel";

export default StatsPanel;
