import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { parseCSV } from "@/lib/csvParser";
import { FileText, ExternalLink, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/timeFormatter";
import { calculateChampionshipStandings, ChampionshipEntry } from "@/lib/pointsCalculator";
import ChampionshipStandingsTable from "@/components/ChampionshipStandingsTable";
import { parseTimeToSeconds } from "@/lib/parseTimeToSeconds";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpxG6EchgG9RszhPdZwv8-ZkHSRo9zxu7moy6t4Nbvg0-Sxi9h7sazU4PdR0lP8T8c5NkFYNgHtL9/pub?output=csv";

interface TournamentData {
  [key: string]: string;
}

// Exporting these interfaces for use in pointsCalculator.ts
export interface LeaderboardEntry {
  rank: number;
  name: string;
  time: string; // This will now store formatted time
  originalTimeValue?: number; // Keep original for sorting if needed, though sorting now happens on parsed values
  powerStageTime: string; // This will now store formatted time
  videoLink?: string;
}

export interface EventLeaderboard {
  eventName: string;
  leaderboard: LeaderboardEntry[];
}

const fetchTournamentData = async (): Promise<TournamentData[]> => {
  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const csvText = await response.text();
  return parseCSV(csvText);
};

// Function to process raw tournament data into structured leaderboards
const processDataForLeaderboards = (data: TournamentData[]): EventLeaderboard[] => {
  if (!data || data.length === 0) {
    return [];
  }

  // Group data by event
  const dataByEvent: Record<string, TournamentData[]> = data.reduce((acc, row) => {
    const eventName = row.event?.trim();
    if (!eventName) return acc; // Skip rows with no event name
    if (!acc[eventName]) {
      acc[eventName] = [];
    }
    acc[eventName].push(row);
    return acc;
  }, {} as Record<string, TournamentData[]>);

  const processedLeaderboards: EventLeaderboard[] = [];

  for (const eventName in dataByEvent) {
    const eventData = dataByEvent[eventName];
    
    // Group data by name within this event
    const dataByName: Record<string, TournamentData[]> = eventData.reduce((acc, row) => {
      const name = row.name?.trim();
      if (!name) return acc; // Skip rows with no name
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(row);
      return acc;
    }, {} as Record<string, TournamentData[]>);

    interface SortableEntry {
      name: string;
      originalTimeSortValue: number; // Actual seconds or Infinity for N/A/invalid
      originalTimeDisplayValue: number | "N/A" | undefined; // From parseTimeToSeconds
      powerStageTimeDisplayValue: number | "N/A" | undefined; // From parseTimeToSeconds
      videoLink?: string;
    }
    
    const entriesForSorting: SortableEntry[] = [];

    for (const name in dataByName) {
      const nameEntries = dataByName[name];
      if (nameEntries.length === 0) continue;

      let bestEntryForSort = nameEntries[0];
      // Initialize bestTimeForSort with the parsed time of the first entry
      let bestTimeForSort = parseTimeToSeconds(bestEntryForSort.time); 

      for (let i = 1; i < nameEntries.length; i++) {
        const currentTimeForSort = parseTimeToSeconds(nameEntries[i].time);
        
        // If currentTime is a number and better than bestTime (or if bestTime is not a number)
        if (typeof currentTimeForSort === 'number') {
          if (typeof bestTimeForSort !== 'number' || currentTimeForSort < bestTimeForSort) {
            bestEntryForSort = nameEntries[i];
            bestTimeForSort = currentTimeForSort;
          }
        } 
        // If bestTime is not a number yet, and currentTime is "N/A", prefer "N/A" over undefined
        else if (currentTimeForSort === "N/A" && bestTimeForSort === undefined) {
            bestEntryForSort = nameEntries[i];
            bestTimeForSort = currentTimeForSort;
        }
      }
      
      const parsedPowerStageTime = parseTimeToSeconds(bestEntryForSort['power stage time']);
      let sortValue: number;

      if (typeof bestTimeForSort === 'number') {
          sortValue = bestTimeForSort;
      } else { // "N/A" or undefined or if no valid time was found
          sortValue = Infinity; 
      }
      
      if (bestEntryForSort.name) { 
          entriesForSorting.push({
              name: bestEntryForSort.name,
              originalTimeSortValue: sortValue,
              originalTimeDisplayValue: bestTimeForSort, // This is already number | "N/A" | undefined
              powerStageTimeDisplayValue: parsedPowerStageTime,
              videoLink: bestEntryForSort['video link'] || undefined,
          });
      }
    }
    
    entriesForSorting.sort((a, b) => a.originalTimeSortValue - b.originalTimeSortValue);

    const toFormatArg = (val: number | "N/A" | undefined): string | undefined => {
      if (val === "N/A") return "N/A";
      if (typeof val === 'number') return val.toString();
      return undefined; 
    };

    const rankedLeaderboard: LeaderboardEntry[] = entriesForSorting.map((entry, index) => ({
      name: entry.name,
      time: formatTime(toFormatArg(entry.originalTimeDisplayValue)),
      originalTimeValue: typeof entry.originalTimeDisplayValue === 'number' ? entry.originalTimeDisplayValue : undefined,
      powerStageTime: formatTime(toFormatArg(entry.powerStageTimeDisplayValue)),
      videoLink: entry.videoLink,
      rank: index + 1,
    }));

    if (rankedLeaderboard.length > 0) {
      processedLeaderboards.push({
        eventName,
        leaderboard: rankedLeaderboard,
      });
    }
  }

  processedLeaderboards.sort((a, b) => a.eventName.localeCompare(b.eventName));
  
  return processedLeaderboards;
};

const Index = () => {
  const { data: rawData, error, isLoading } = useQuery<TournamentData[], Error>({
    queryKey: ["tournamentData"],
    queryFn: fetchTournamentData,
  });

  const leaderboards = rawData ? processDataForLeaderboards(rawData) : [];
  const championshipStandings = leaderboards.length > 0 ? calculateChampionshipStandings(leaderboards) : [];

  return (
    <div className="min-h-screen bg-charcoal-gray text-pure-white p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-bright-blue mb-2">Tournament Standings</h1>
        <p className="text-xl text-light-gray">Live results from the championship</p>
      </header>

      <main className="container mx-auto">
        {isLoading && (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => ( // Skeleton for a couple of cards
              <Card key={i} className="bg-dark-charcoal shadow-xl">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-2" />
                  <Skeleton className="h-10 w-full mb-2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="bg-destructive/20 border-destructive text-destructive-foreground">
            <FileText className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>
              There was a problem fetching the tournament data: {error.message}. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && leaderboards.length > 0 && (
          <div className="space-y-8 mt-8">
            {championshipStandings.length > 0 && (
              <ChampionshipStandingsTable standings={championshipStandings} />
            )}
            {leaderboards.map((eventLeaderboard) => (
              <Card key={eventLeaderboard.eventName} className="bg-dark-charcoal shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-sky-blue">{eventLeaderboard.eventName}</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventLeaderboard.leaderboard.length > 0 ? (
                    <Table className="text-silver-gray">
                      <TableHeader>
                        <TableRow className="border-medium-gray hover:bg-mid-gray/20">
                          <TableHead className="text-sky-blue font-semibold w-16">Rank</TableHead>
                          <TableHead className="text-sky-blue font-semibold">Name</TableHead>
                          <TableHead className="text-sky-blue font-semibold">Time</TableHead>
                          <TableHead className="text-sky-blue font-semibold">Power Stage Time</TableHead>
                          <TableHead className="text-sky-blue font-semibold">Video</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventLeaderboard.leaderboard.map((entry) => (
                          <TableRow key={`${eventLeaderboard.eventName}-${entry.name}-${entry.rank}`} className="border-medium-gray hover:bg-mid-gray/10">
                            <TableCell className="py-3 px-4 font-medium">{entry.rank}</TableCell>
                            <TableCell className="py-3 px-4">{entry.name}</TableCell>
                            <TableCell className="py-3 px-4">{entry.time}</TableCell>
                            <TableCell className="py-3 px-4">{entry.powerStageTime}</TableCell>
                            <TableCell className="py-3 px-4">
                              {entry.videoLink ? (
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-bright-blue hover:text-sky-blue"
                                  asChild
                                >
                                  <a href={entry.videoLink} target="_blank" rel="noopener noreferrer">
                                    Watch <ExternalLink className="inline-block h-4 w-4 ml-1" />
                                  </a>
                                </Button>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                     <p className="text-light-gray">No entries for this event.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && !error && leaderboards.length === 0 && rawData && rawData.length > 0 && (
           <Alert className="bg-dark-gray/50 border-medium-gray">
            <FileText className="h-4 w-4 text-sky-blue" />
            <AlertTitle className="text-sky-blue">No Leaderboards Generated</AlertTitle>
            <AlertDescription className="text-light-gray">
              Data was fetched, but no valid leaderboard entries could be generated. Check if 'event', 'name', and 'time' columns are correctly populated in the CSV.
            </AlertDescription>
          </Alert>
        )}
         {!isLoading && !error && rawData && rawData.length === 0 && (
           <Alert className="bg-dark-gray/50 border-medium-gray">
            <FileText className="h-4 w-4 text-sky-blue" />
            <AlertTitle className="text-sky-blue">No Data Available</AlertTitle>
            <AlertDescription className="text-light-gray">
              The tournament data sheet appears to be empty or could not be parsed correctly.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <footer className="text-center mt-8 text-medium-gray text-sm">
        <p>&copy; {new Date().getFullYear()} Tourney Sheet Champ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
