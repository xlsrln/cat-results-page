import { EventLeaderboard, LeaderboardEntry } from "@/pages/Index"; // Assuming interfaces are exported from Index or a shared types file
import { formatTime } from "./timeFormatter"; // For consistent power stage time display if needed within this logic
import { parseTimeToSeconds } from "./parseTimeToSeconds"; // Added import

export interface ChampionshipEntry {
  rank: number;
  name: string;
  totalPoints: number;
}

const eventPointsMap: Record<number, number> = {
  1: 25, 2: 23, 3: 21, 4: 19, 5: 17, 6: 16, 7: 15, 8: 14, 9: 13, 10: 12,
  11: 11, 12: 10, 13: 9, 14: 8, 15: 7, 16: 6, 17: 5, 18: 4, 19: 3, 20: 2,
};
const MIN_EVENT_POINTS = 1; // For ranks 21 or higher

const powerStagePointsMap: Record<number, number> = {
  1: 5, 2: 4, 3: 3, 4: 2, 5: 1,
};

export const calculateChampionshipStandings = (eventLeaderboards: EventLeaderboard[]): ChampionshipEntry[] => {
  const totalPointsByName: Record<string, number> = {};

  // Helper to safely add points
  const addPoints = (name: string, points: number) => {
    if (!name) return;
    totalPointsByName[name] = (totalPointsByName[name] || 0) + points;
  };

  eventLeaderboards.forEach(event => {
    // Calculate Event Points
    event.leaderboard.forEach(entry => {
      // Points based on overall rank in the event
      // If originalTimeValue is available and valid, could use it to break ties or validate DNF etc.
      // For now, direct rank is used.
      const points = eventPointsMap[entry.rank] || MIN_EVENT_POINTS;
      addPoints(entry.name, points);
    });

    // Calculate Power Stage Points
    const powerStageContenders = event.leaderboard
      .map(entry => ({
        name: entry.name,
        // entry.powerStageTime is a formatted string like "MM:SS.mmm" or "N/A"
        // We parse it to get numerical seconds for sorting.
        timeValue: parseTimeToSeconds(entry.powerStageTime),
      }))
      // Filter out entries where timeValue is not a valid number (e.g., "N/A" or undefined from parsing)
      .filter(entry => typeof entry.timeValue === 'number' && !isNaN(entry.timeValue) && entry.timeValue >= 0)
      // Explicitly cast timeValue to number after filter for sort comparison
      .map(entry => ({ ...entry, timeValue: entry.timeValue as number }))
      .sort((a, b) => a.timeValue - b.timeValue);

    powerStageContenders.forEach((contender, index) => {
      const powerStageRank = index + 1;
      const points = powerStagePointsMap[powerStageRank] || 0;
      if (points > 0) {
        addPoints(contender.name, points);
      }
    });
  });

  const sortedStandings: Omit<ChampionshipEntry, 'rank'>[] = Object.entries(totalPointsByName)
    .map(([name, totalPoints]) => ({ name, totalPoints }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return sortedStandings.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};
