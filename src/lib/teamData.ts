
import { parseCSV } from "./csvParser";

const TEAM_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpxG6EchgG9RszhPdZwv8-ZkHSRo9zxu7moy6t4Nbvg0-Sxi9h7sazU4PdR0lP8T8c5NkFYNgHtL9/pub?gid=1952463698&single=true&output=csv";

interface TeamMemberData {
  [key: string]: string;
}

export interface TeamMembership {
  [driverName: string]: string; // maps driver name to team name
}

export const fetchTeamData = async (): Promise<TeamMembership> => {
  const response = await fetch(TEAM_CSV_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const csvText = await response.text();
  const data: TeamMemberData[] = parseCSV(csvText);
  
  const teamMembership: TeamMembership = {};
  
  data.forEach(row => {
    const driverName = row.driver?.trim();
    const teamName = row.team?.trim();
    
    if (driverName && teamName) {
      teamMembership[driverName].toLowerCase() = teamName.toLowerCase();
    }
  });
  
  return teamMembership;
};
