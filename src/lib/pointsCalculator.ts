import { EventLeaderboard } from "@/pages/Index"; // Assuming interfaces are exported from Index or a shared types file
import { formatTime } from "./timeFormatter"; // For consistent power stage time display if needed within this logic
import { parseTimeToSeconds } from "./parseTimeToSeconds"; // Added import

export interface ChampionshipEntry {
  rank: number;
  name: string;
  totalPoints: number;
  pointsPerEvent: Record<string, number>; // Key: eventName, Value: points for that event
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
  // Store total points and points per event for each participant
  const pointsDataByName: Record<string, { totalPoints: number; events: Record<string, number> }> = {};

  // Helper to safely add points to both total and specific event
  const addPoints = (name: string, eventName: string, pointsToAdd: number) => {
    if (!name || pointsToAdd === 0) return; // Don't process if no name or no points to add

    if (!pointsDataByName[name]) {
      pointsDataByName[name] = { totalPoints: 0, events: {} };
    }
    pointsDataByName[name].totalPoints += pointsToAdd;
    pointsDataByName[name].events[eventName] = (pointsDataByName[name].events[eventName] || 0) + pointsToAdd;
  };

  eventLeaderboards.forEach(event => {
    const currentEventName = event.eventName; // Capture event name for use in addPoints

    // Calculate Event Points
    event.leaderboard.forEach(entry => {
      // Points based on overall rank in the event
      // If originalTimeValue is available and valid, could use it to break ties or validate DNF etc.
      // For now, direct rank is used.
      const points = eventPointsMap[entry.rank] || MIN_EVENT_POINTS;
      addPoints(entry.name, currentEventName, points);
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
      const powerStageBonusPoints = powerStagePointsMap[powerStageRank] || 0;
      if (powerStageBonusPoints > 0) {
        // Add power stage points to the specific event's score and total score
        addPoints(contender.name, currentEventName, powerStageBonusPoints);
      }
    });
  });

  // Map to the ChampionshipEntry structure including pointsPerEvent
  const sortedStandings: Omit<ChampionshipEntry, 'rank'>[] = Object.entries(pointsDataByName)
    .map(([name, data]) => ({
      name,
      totalPoints: data.totalPoints,
      pointsPerEvent: data.events, // Include the breakdown of points per event
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints); // Sort by total points descending

  // Add rank
  return sortedStandings.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};
