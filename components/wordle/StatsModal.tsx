"use client";

import { useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getStats } from '@/lib/stats';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type StatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BAR_COLOR = 'hsl(var(--correct))';

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const stats = useMemo(() => (typeof window !== 'undefined' && isOpen ? getStats() : null), [isOpen]);

  const chartData = useMemo(() => {
    if (!stats) return [];
    return stats.winsByGuesses.map((count, i) => ({
      try: i + 1,
      label: `${i + 1}`,
      count,
    }));
  }, [stats]);

  const winPercentage =
    stats && stats.gamesPlayed > 0
      ? Math.round((stats.wins / stats.gamesPlayed) * 100)
      : 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Statistics</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.gamesPlayed ?? 0}</p>
              <p className="text-xs text-muted-foreground">Played</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{winPercentage}</p>
              <p className="text-xs text-muted-foreground">Win %</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.wins ?? 0}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">Guess distribution</p>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide allowDecimals={false} />
                <Bar dataKey="count" radius={4} maxBarSize={40}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={BAR_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
