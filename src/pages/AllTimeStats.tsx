import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { MedalTable } from '@/components/MedalTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Download, Trophy, Users, ListChecks } from 'lucide-react';
import { calculateDriverMedals, DriverMedals } from '@/lib/medalCounter';
import { LeaderboardEntry, EventLeaderboard } from '@/pages/Index';
import { teamInformation, TeamInfo } from '@/lib/teamInfo';

// Import raw markdown content
import season1Content from "@/content/seasons/season-1.md?raw";
import season2Content from "@/content/seasons/season-2.md?raw";
import season3Content from "@/content/seasons/season-3.md?raw";
import season4Content from "@/content/seasons/season-4.md?raw";
import season5Content from "@/content/seasons/season-5.md?raw";

const seasonData = [
  { name: "Season 1", content: season1Content, year: 2021 },
  { name: "Season 2", content: season2Content, year: 2022 },
  { name: "Season 3", content: season3Content, year: 2023 },
  { name: "Season 4", content: season4Content, year: 2024 },
  { name: "Season 5", content: season5Content, year: 2025 },
];

const parseRallyResults = (markdownContent: string, seasonName: string): EventLeaderboard[] => {
  const rallyEvents: EventLeaderboard[] = [];
  const lines = markdownContent.split('\n');

  let currentRallyDisplayName: string | null = null;
  let currentLeaderboard: LeaderboardEntry[] = [];
  let processingTable = false; // True if we are past the header and separator of a rally table

  const rallyHeaderRegex = /^##\s*rally\s*(?:\d+\s*[:-\s]*)?(.*)/i;
  const tableRowRegex = /^\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/;

  const finalizeCurrentRally = () => {
    if (currentRallyDisplayName && currentLeaderboard.length > 0) {
      rallyEvents.push({
        eventName: `${seasonName} - ${currentRallyDisplayName}`,
        leaderboard: [...currentLeaderboard],
      });
    }
    currentLeaderboard = [];
    processingTable = false;
    currentRallyDisplayName = null;
  };

  for (const line of lines) {
    const rallyHeaderMatch = line.match(rallyHeaderRegex);

    if (rallyHeaderMatch) {
      finalizeCurrentRally();
      currentRallyDisplayName = rallyHeaderMatch[1].trim();
      continue;
    }

    if (currentRallyDisplayName) {
      if (!processingTable) {
        if (line.trim().startsWith("|") && line.includes("---")) {
          processingTable = true;
        }
        continue;
      }
      
      if (processingTable) {
        if (!line.trim().startsWith("|")) {
          finalizeCurrentRally();
          const newRallyMatchAfterTableEnd = line.match(rallyHeaderRegex);
          if (newRallyMatchAfterTableEnd) {
            currentRallyDisplayName = newRallyMatchAfterTableEnd[1].trim();
            continue;
          }
          continue;
        }

        const rowMatch = line.match(tableRowRegex);
        if (rowMatch) {
          const rank = parseInt(rowMatch[1], 10);
          const name = rowMatch[2].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]+>/g, '').trim();
          if (rank >= 1 && rank <= 3) {
            currentLeaderboard.push({
              rank,
              name,
              time: "N/A",
              powerStageTime: "N/A",
              individualPoints: 0,
              teamPoints: 0,
            });
          }
        }
      }
    }
  }

  finalizeCurrentRally();
  return rallyEvents;
};

const parseChampionName = (markdownContent: string): string | null => {
  const lines = markdownContent.split('\n');
  let inStandingsTable = false;
  const standingsHeaderRegex = /^##\s*standings\s*$/i;
  const championRowRegex = /^\s*\|\s*1\s*\|\s*([^|]+?)\s*\|/;

  for (const line of lines) {
    if (standingsHeaderRegex.test(line.trim())) {
      inStandingsTable = true;
      continue;
    }

    if (inStandingsTable) {
      if (line.trim().startsWith("## ") || (line.trim() !== "" && !line.trim().startsWith("|"))) {
        inStandingsTable = false;
        continue;
      }
      const match = line.match(championRowRegex);
      if (match && match[1]) {
        return match[1].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]+>/g, '').trim();
      }
    }
  }
  return null;
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

const AllTimeStats = () => {
  const [allTimeMedals, setAllTimeMedals] = useState<DriverMedals[]>([]);
  const [championshipsByDriver, setChampionshipsByDriver] = useState<Record<string, number>>({});

  useEffect(() => {
    const allRallyEvents: EventLeaderboard[] = [];
    const currentChampionships: Record<string, number> = {};

    seasonData.forEach(season => {
      const rallyLeaderboards = parseRallyResults(season.content, season.name);
      allRallyEvents.push(...rallyLeaderboards);

      const champion = parseChampionName(season.content);
      if (champion) {
        currentChampionships[champion] = (currentChampionships[champion] || 0) + 1;
      }
    });

    if (allRallyEvents.length > 0) {
      const medals = calculateDriverMedals(allRallyEvents);
      setAllTimeMedals(medals);
    }
    setChampionshipsByDriver(currentChampionships);
  }, []);

  const handleDownloadCSV = () => {
    if (allTimeMedals.length > 0) {
      let csvString = "Driver,Championships,Gold,Silver,Bronze,Total\n";
      allTimeMedals.forEach(d => {
        const championships = championshipsByDriver[d.name] || 0;
        csvString += `"${d.name.replace(/"/g, '""')}",${championships},${d.medals.gold},${d.medals.silver},${d.medals.bronze},${d.total}\n`;
      });
      downloadCSV(csvString, "cat_rally_hall_of_fame.csv");
    }
  };

  const sortedTeams = Object.values(teamInformation).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Hall of Fame</h1>
          <p className="text-xl text-gray-600">Celebrating driver rally medals, championships, and team accolades.</p>
        </header>

        {allTimeMedals.length > 0 || Object.keys(championshipsByDriver).length > 0 ? (
          <>
            <div className="my-6 flex justify-end">
              <Button onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
            <MedalTable 
              driverMedals={allTimeMedals} 
              championshipsByDriver={championshipsByDriver} 
              title="Driver Accolades" 
            />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No medal or championship data could be compiled. Check markdown files.</p>
          </div>
        )}

        <section className="mt-16">
          <header className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-2">Team Accolades</h2>
            <p className="text-lg text-gray-600">Recognizing team achievements throughout the seasons.</p>
          </header>
          {sortedTeams.length > 0 ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {sortedTeams.map((team) => (
                <Card key={team.name} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-6 w-6 text-primary" /> 
                      {team.name}
                    </CardTitle>
                    {team.foundedYear && (
                      <CardDescription>Founded: {team.foundedYear}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {team.philosophy && (
                      <p className="italic text-sm text-muted-foreground mb-4">"{team.philosophy}"</p>
                    )}
                    {team.achievements && team.achievements.length > 0 ? (
                      <>
                        <h4 className="font-semibold mb-2 flex items-center text-sm">
                          <ListChecks className="mr-2 h-4 w-4 text-green-600" />
                          Key Achievements:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {team.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No specific achievements listed.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-8">
              <p className="text-gray-500">No team information available.</p>
            </div>
          )}
        </section>
      </div>
      <footer className="bg-gray-50 border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CAT Rally Championship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AllTimeStats;
