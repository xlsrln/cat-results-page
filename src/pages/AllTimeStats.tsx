
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

// This function is no longer used for the primary medal table on this page,
// but kept in case it's needed elsewhere or for a different feature.
// const parseSeasonChampionship = (markdownContent: string, seasonIdentifier: string): EventLeaderboard | null => {
//   // ... existing parseSeasonChampionship code ...
// };

const parseRallyResults = (markdownContent: string, seasonName: string): EventLeaderboard[] => {
  const rallyEvents: EventLeaderboard[] = [];
  const lines = markdownContent.split('\n');

  let currentRallyDisplayName: string | null = null;
  let currentLeaderboard: LeaderboardEntry[] = [];
  let processingTable = false; // True if we are past the header and separator of a rally table

  const rallyHeaderRegex = /^##\s*rally\s*(?:\d+\s*[:-\s]*)?(.*)/i;
  // Extracts rank (group 1) and name (group 2) from a table row.
  // Example: | 1 | Driver Name | ...
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
    currentRallyDisplayName = null; // Reset display name after finalizing
  };

  for (const line of lines) {
    const rallyHeaderMatch = line.match(rallyHeaderRegex);

    if (rallyHeaderMatch) {
      finalizeCurrentRally(); // Finalize previous rally before starting new one
      currentRallyDisplayName = rallyHeaderMatch[1].trim();
      continue; // Processed header, move to next line
    }

    if (currentRallyDisplayName) { // Only process if we are within a rally section
      if (!processingTable) {
        // Look for table separator to confirm we are about to read data
        // e.g. |----|------|... or |:---|:----|...
        if (line.trim().startsWith("|") && line.includes("---")) {
            processingTable = true; // Table data rows should start from the next line
        }
        // We don't 'continue' here because the very next line might be a data row if table header was absent/unconventional
        // Or, this line itself could be a new rally header if the table ended abruptly.
      }
      
      if (processingTable) {
         // If line does not start with '|', it signifies the end of the current table.
        if (!line.trim().startsWith("|")) {
          finalizeCurrentRally();
          // The current line might be a new rally header or other content.
          // If it's a new rally header, the main loop's `rallyHeaderMatch` will catch it in the next iteration
          // or if we re-evaluate immediately. For simplicity, rely on next iteration.
          // However, if it was just blank lines or non-table text, currentRallyDisplayName would be null now.
          // We need to check if this non-pipe line is a NEW rally header itself.
          const newRallyMatchAfterTableEnd = line.match(rallyHeaderRegex);
          if (newRallyMatchAfterTableEnd) {
            // It's a new rally header immediately after table end.
            // Finalize already called, set new rally name and continue.
             currentRallyDisplayName = newRallyMatchAfterTableEnd[1].trim();
             // processingTable will be false from finalizeCurrentRally
          }
          continue; // Table ended, move to next line.
        }

        const rowMatch = line.match(tableRowRegex);
        if (rowMatch) {
          const rank = parseInt(rowMatch[1], 10);
          // Clean the name: remove markdown links [text](url) and any HTML tags like <img>
          const name = rowMatch[2].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]+>/g, '').trim();

          if (rank >= 1 && rank <= 3) { // Only care about medal positions
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

  finalizeCurrentRally(); // Finalize any remaining rally after processing all lines
  return rallyEvents;
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
    const allRallyEvents: EventLeaderboard[] = [];
    seasonData.forEach(season => {
      // console.log(`Parsing rallies for ${season.name}`);
      const rallyLeaderboards = parseRallyResults(season.content, season.name);
      // console.log(`Found ${rallyLeaderboards.length} rally events in ${season.name}`);
      allRallyEvents.push(...rallyLeaderboards);
    });

    if (allRallyEvents.length > 0) {
      // console.log(`Total rally events compiled: ${allRallyEvents.length}`);
      // allRallyEvents.forEach(event => {
      //   if (event.leaderboard.length === 0) {
      //     console.warn(`Event ${event.eventName} has no leaderboard entries for medals.`);
      //   }
      // });
      const medals = calculateDriverMedals(allRallyEvents);
      // console.log('Calculated Medals:', medals);
      setAllTimeMedals(medals);
    } else {
      // console.warn("No rally events found across all seasons.");
    }
  }, []);

  const handleDownloadCSV = () => {
    if (allTimeMedals.length > 0) {
      let csvString = "Driver,Gold,Silver,Bronze,Total\n";
      allTimeMedals.forEach(d => {
        csvString += `"${d.name.replace(/"/g, '""')}",${d.medals.gold},${d.medals.silver},${d.medals.bronze},${d.total}\n`;
      });
      downloadCSV(csvString, "cat_rally_all_time_rally_medals.csv");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">All-Time Rally Medals</h1>
          <p className="text-xl text-gray-600">Medal table based on individual rally results (top 3) from all seasons.</p>
        </header>

        {allTimeMedals.length > 0 ? (
          <>
            <div className="my-6 flex justify-end">
              <Button onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
            <MedalTable driverMedals={allTimeMedals} title="All-Time Rally Medal Tally" />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No rally medal data could be compiled. Check markdown files for rally result tables.</p>
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
