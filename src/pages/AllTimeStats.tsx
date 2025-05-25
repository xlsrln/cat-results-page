
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { MedalTable } from '@/components/MedalTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { calculateDriverMedals, DriverMedals } from '@/lib/medalCounter';
import { LeaderboardEntry, EventLeaderboard } from '@/pages/Index'; // Re-using types

// Import raw markdown content
import season1Content from "@/content/seasons/season-1.md?raw";
import season2Content from "@/content/seasons/season-2.md?raw";
import season3Content from "@/content/seasons/season-3.md?raw";
import season4Content from "@/content/seasons/season-4.md?raw";
import season5Content from "@/content/seasons/season-5.md?raw";

const seasonData = [
  { name: "Season 1", content: season1Content },
  { name: "Season 2", content: season2Content },
  { name: "Season 3", content: season3Content },
  { name: "Season 4", content: season4Content },
  { name: "Season 5", content: season5Content },
];

const parseSeasonChampionship = (markdownContent: string, seasonIdentifier: string): EventLeaderboard | null => {
  const standingsHeader = "## Championship Standings";
  const headerIndex = markdownContent.indexOf(standingsHeader);
  if (headerIndex === -1) {
    console.warn(`Championship Standings header not found for ${seasonIdentifier}`);
    return null;
  }

  const tableStartString = "|:---"; // A common part of markdown table header separator
  const tableStartIndex = markdownContent.indexOf(tableStartString, headerIndex);
  if (tableStartIndex === -1) {
    console.warn(`Table structure not found for ${seasonIdentifier} Championship Standings`);
    return null;
  }

  // Extract the part of markdown from the table separator onwards
  const tableRelevantContent = markdownContent.substring(tableStartIndex);
  const rows = tableRelevantContent.split('\n').slice(1); // Skip the separator row itself

  const leaderboard: LeaderboardEntry[] = [];
  // Regex to capture: | Position | Driver Name | (anything) | (anything) |
  const rankRegex = /\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|[^|]*\|[^|]*\|/;

  for (const row of rows) {
    const trimmedRow = row.trim();
    if (!trimmedRow.startsWith("|")) { // Stop if it's no longer a table row
        if (leaderboard.length > 0) break; // If we've already captured some, assume table ended
        else continue; // Skip empty lines or non-table lines before the first entry
    }

    const match = trimmedRow.match(rankRegex);
    if (match) {
      const rank = parseInt(match[1], 10);
      const name = match[2].trim();
      // We're interested in medal positions (1st, 2nd, 3rd)
      if (rank >= 1 && rank <= 3) {
        leaderboard.push({
          rank,
          name,
          time: "N/A", // Time is not applicable for season championship medals
          powerStageTime: "N/A", // Power stage time is not applicable
          individualPoints: 0, // Points not directly used for this medal calculation
          teamPoints: 0, // Team points not directly used
        });
      }
    }
  }

  if (leaderboard.length === 0) {
    console.warn(`No leaderboard entries extracted for ${seasonIdentifier}`);
    return null;
  }
  
  return { eventName: `${seasonIdentifier} Championship`, leaderboard };
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

  useEffect(() => {
    const allSeasonEvents: EventLeaderboard[] = [];
    seasonData.forEach(season => {
      const eventLeaderboard = parseSeasonChampionship(season.content, season.name);
      if (eventLeaderboard) {
        allSeasonEvents.push(eventLeaderboard);
      }
    });

    if (allSeasonEvents.length > 0) {
      const medals = calculateDriverMedals(allSeasonEvents);
      setAllTimeMedals(medals);
    }
  }, []);

  const handleDownloadCSV = () => {
    if (allTimeMedals.length > 0) {
      let csvString = "Driver,Gold,Silver,Bronze,Total\n";
      allTimeMedals.forEach(d => {
        csvString += `"${d.name.replace(/"/g, '""')}",${d.medals.gold},${d.medals.silver},${d.medals.bronze},${d.total}\n`;
      });
      downloadCSV(csvString, "cat_rally_all_time_medals.csv");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">All-Time Championship Medals</h1>
          <p className="text-xl text-gray-600">Medal table based on all seasons.</p>
        </header>

        {allTimeMedals.length > 0 ? (
          <>
            <div className="my-6 flex justify-end">
              <Button onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
            <MedalTable driverMedals={allTimeMedals} title="All-Time Championship Medal Tally" />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No medal data could be compiled. Check console for parsing warnings.</p>
          </div>
        )}
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
