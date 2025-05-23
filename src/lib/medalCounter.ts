
import { EventLeaderboard } from "@/pages/Index";

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export interface DriverMedals {
  name: string;
  medals: MedalCount;
  total: number;
}

export const calculateDriverMedals = (eventLeaderboards: EventLeaderboard[]): DriverMedals[] => {
  const medalCounts: Record<string, MedalCount> = {};

  eventLeaderboards.forEach(event => {
    event.leaderboard.forEach(entry => {
      if (!medalCounts[entry.name]) {
        medalCounts[entry.name] = { gold: 0, silver: 0, bronze: 0 };
      }

      if (entry.rank === 1) {
        medalCounts[entry.name].gold++;
      } else if (entry.rank === 2) {
        medalCounts[entry.name].silver++;
      } else if (entry.rank === 3) {
        medalCounts[entry.name].bronze++;
      }
    });
  });

  return Object.entries(medalCounts)
    .map(([name, medals]) => ({
      name,
      medals,
      total: medals.gold + medals.silver + medals.bronze,
    }))
    .filter(driver => driver.total > 0)
    .sort((a, b) => {
      // Sort by gold first, then silver, then bronze
      if (b.medals.gold !== a.medals.gold) return b.medals.gold - a.medals.gold;
      if (b.medals.silver !== a.medals.silver) return b.medals.silver - a.medals.silver;
      return b.medals.bronze - a.medals.bronze;
    });
};
