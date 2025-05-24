
import { EventLeaderboard } from "@/pages/Index";
import { TeamMembership } from "./teamData";

export interface TeamChampionshipEntry {
  rank: number;
  teamName: string;
  totalPoints: number;
  pointsPerEvent: Record<string, number>;
}

const eventPointsMap: Record<number, number> = {
  1: 25, 2: 23, 3: 21, 4: 19, 5: 17, 6: 16, 7: 15, 8: 14, 9: 13, 10: 12,
  11: 11, 12: 10, 13: 9, 14: 8, 15: 7, 16: 6, 17: 5, 18: 4, 19: 3, 20: 2,
};
const MIN_EVENT_POINTS = 1;

export const calculateTeamChampionshipStandings = (
  eventLeaderboards: EventLeaderboard[],
  teamMembership: TeamMembership
): TeamChampionshipEntry[] => {
  const teamPointsData: Record<string, { totalPoints: number; events: Record<string, number> }> = {};

  const addTeamPoints = (teamName: string, eventName: string, pointsToAdd: number) => {
    if (!teamName || pointsToAdd === 0) return;

    if (!teamPointsData[teamName]) {
      teamPointsData[teamName] = { totalPoints: 0, events: {} };
    }
    teamPointsData[teamName].totalPoints += pointsToAdd;
    teamPointsData[teamName].events[eventName] = (teamPointsData[teamName].events[eventName] || 0) + pointsToAdd;
  };

  eventLeaderboards.forEach(event => {
    // Group drivers by team for this event
    const teamDrivers: Record<string, Array<{ name: string; rank: number }>> = {};
    
    event.leaderboard.forEach(entry => {
      const teamName = teamMembership[entry.name];
      if (teamName) {
        if (!teamDrivers[teamName]) {
          teamDrivers[teamName] = [];
        }
        teamDrivers[teamName].push({ name: entry.name, rank: entry.rank });
      }
    });

    // Collect all top 3 drivers from each team
    const allTopDrivers = [];
    Object.entries(teamDrivers).forEach(([teamName, drivers]) => {
      // Sort by rank (best rank first)
      drivers.sort((a, b) => a.rank - b.rank);
      
      // Take top 3 drivers
      const topThreeDrivers = drivers.slice(0, 3);
      allTopDrivers.push(...topThreeDrivers);
    });
    
    // Sort all top drivers by rank
    allTopDrivers.sort((a, b) => a.rank - b.rank);
    
    // Redistribute points as if only these drivers exist
    allTopDrivers.forEach((driver, index) => {
      const overallRank = index + 1; // 1st, 2nd, 3rd overall
      const points = eventPointsMap[overallRank] || MIN_EVENT_POINTS;
      const teamName = Object.keys(teamDrivers).find(team => teamDrivers[team].includes(driver));
      addTeamPoints(teamName, event.eventName, points);
    });
  });

  // Convert to sorted championship entries
  const sortedStandings: Omit<TeamChampionshipEntry, 'rank'>[] = Object.entries(teamPointsData)
    .map(([teamName, data]) => ({
      teamName,
      totalPoints: data.totalPoints,
      pointsPerEvent: data.events,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return sortedStandings.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

// Helper function to calculate individual driver points for team contribution
export const calculateDriverTeamPoints = (
  driverName: string,
  eventName: string,
  eventLeaderboards: EventLeaderboard[],
  teamMembership: TeamMembership
): number => {
  const teamName = teamMembership[driverName];
  if (!teamName) return 0;

  const event = eventLeaderboards.find(e => e.eventName === eventName);
  if (!event) return 0;

  // Find all team drivers in this event
  const teamDrivers = event.leaderboard
    .filter(entry => teamMembership[entry.name] === teamName)
    .sort((a, b) => a.rank - b.rank);

  // Find this driver's position within the team
  const driverTeamPosition = teamDrivers.findIndex(driver => driver.name === driverName);
  
  // Only top 3 drivers from each team score points
  if (driverTeamPosition >= 3 || driverTeamPosition === -1) return 0;

  // Collect all top 3 drivers from each team across all teams
  const allTopDrivers = [];
  
  // First, collect all teams with drivers in this event
  const teamsInEvent = new Set<string>();
  event.leaderboard.forEach(entry => {
    const team = teamMembership[entry.name];
    if (team) teamsInEvent.add(team);
  });
  
  // For each team, add their top 3 drivers to the list
  Array.from(teamsInEvent).forEach(team => {
    const teamDriversInEvent = event.leaderboard
      .filter(entry => teamMembership[entry.name] === team)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3); // Only take top 3
      
    allTopDrivers.push(...teamDriversInEvent);
  });
  
  // Sort all top drivers by their overall rank in the event
  allTopDrivers.sort((a, b) => a.rank - b.rank);
  
  // Find this driver's position within all top drivers
  const overallPosition = allTopDrivers.findIndex(driver => driver.name === driverName);
  
  if (overallPosition === -1) return 0;
  
  // Return points based on this overall position among top drivers from all teams
  return eventPointsMap[overallPosition + 1] || MIN_EVENT_POINTS;
};
