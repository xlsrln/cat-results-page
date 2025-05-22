import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { parseCSV } from "@/lib/csvParser";
import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/timeFormatter";
import { calculateChampionshipStandings, ChampionshipEntry } from "@/lib/pointsCalculator";
import ChampionshipStandingsTable from "@/components/ChampionshipStandingsTable";
import PointsBreakdownTable from "@/components/PointsBreakdownTable";
import { parseTimeToSeconds } from "@/lib/parseTimeToSeconds";
import { slugify } from "@/lib/slugify";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpxG6EchgG9RszhPdZwv8-ZkHSRo9zxu7moy6t4Nbvg0-Sxi9h7sazU4PdR0lP8T8c5NkFYNgHtL9/pub?gid=1794825689&single=true&output=csv";

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
const processDataForLeaderboards = (data: TournamentData[]): { leaderboards: EventLeaderboard[], orderedEventNames: string[] } => {
  if (!data || data.length === 0) {
    return { leaderboards: [], orderedEventNames: [] };
  }

  // Get unique event names in their order of appearance from the raw data
  const orderedEventNames: string[] = [];
  const eventSet = new Set<string>();
  for (const row of data) {
    const eventName = row.event?.trim();
    if (eventName && !eventSet.has(eventName)) {
      eventSet.add(eventName);
      orderedEventNames.push(eventName);
    }
  }

  // Group data by event for efficient lookup
  const dataByEvent: Record<string, TournamentData[]> = data.reduce((acc, row) => {
    const eventName = row.event?.trim();
    if (!eventName) return acc;
    if (!acc[eventName]) {
      acc[eventName] = [];
    }
    acc[eventName].push(row);
    return acc;
  }, {} as Record<string, TournamentData[]>);

  const processedLeaderboards: EventLeaderboard[] = [];

  for (const eventName of orderedEventNames) { // Iterate in chronological order
    const eventData = dataByEvent[eventName];
    if (!eventData) continue;
    
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
      
      const parsedPowerStageTime = parseTimeToSeconds(bestEntryForSort['ps']);
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
  
  return { leaderboards: processedLeaderboards, orderedEventNames };
};

const Index = () => {
  const { data: rawData, error, isLoading } = useQuery<TournamentData[], Error>({
    queryKey: ["tournamentData"],
    queryFn: fetchTournamentData,
  });

  const { leaderboards, orderedEventNames } = rawData ? processDataForLeaderboards(rawData) : { leaderboards: [], orderedEventNames: [] };
  const championshipStandings: ChampionshipEntry[] = leaderboards.length > 0 ? calculateChampionshipStandings(leaderboards) : [];

  // Extract unique event names for the PointsBreakdownTable headers
  // const uniqueEventNames = Array.from(new Set(leaderboards.map(lb => lb.eventName)));

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">CAT S5 results</h1>
        <p className="text-xl text-muted-foreground">Live results from the championship</p>
      </header>

      <main className="container mx-auto">
        {isLoading && (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => ( 
              <Card key={i} className="shadow-xl">
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
          <Alert variant="destructive">
            <FileText className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>
              There was a problem fetching the tournament data: {error.message}. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && leaderboards.length > 0 && (
          <div className="space-y-8 mt-8">
            {/* Render the new PointsBreakdownTable */}
            {championshipStandings.length > 0 && (
              <PointsBreakdownTable standings={championshipStandings} eventNames={orderedEventNames} />
            )}
            {leaderboards.map((eventLeaderboard) => (
              <Card key={eventLeaderboard.eventName} id={slugify(eventLeaderboard.eventName)} className="shadow-xl scroll-mt-20">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">{eventLeaderboard.eventName}</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventLeaderboard.leaderboard.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-black font-semibold w-16">Rank</TableHead>
                          <TableHead className="text-black font-semibold">Name</TableHead>
                          <TableHead className="text-black font-semibold">Time</TableHead>
                          <TableHead className="text-black font-semibold">Power Stage Time</TableHead>
                          <TableHead className="text-black font-semibold">Video</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventLeaderboard.leaderboard.map((entry) => (
                          <TableRow key={`${eventLeaderboard.eventName}-${entry.name}-${entry.rank}`}>
                            <TableCell className="py-3 px-4 font-medium">{entry.rank}</TableCell>
                            <TableCell className="py-3 px-4">{entry.name}</TableCell>
                            <TableCell className="py-3 px-4">{entry.time}</TableCell>
                            <TableCell className="py-3 px-4">{entry.powerStageTime}</TableCell>
                            <TableCell className="py-3 px-4">
                              {entry.videoLink ? (
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-bright-blue hover:text-black"
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
                     <p className="text-muted-foreground">No entries for this event.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && !error && leaderboards.length === 0 && rawData && rawData.length > 0 && (
           <Alert>
            <FileText className="h-4 w-4 text-black" />
            <AlertTitle className="text-black">No Leaderboards Generated</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Data was fetched, but no valid leaderboard entries could be generated. Check if 'event', 'name', and 'time' columns are correctly populated in the CSV.
            </AlertDescription>
          </Alert>
        )}
         {!isLoading && !error && rawData && rawData.length === 0 && (
           <Alert>
            <FileText className="h-4 w-4 text-black" />
            <AlertTitle className="text-black">No Data Available</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              The tournament data sheet appears to be empty or could not be parsed correctly.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <footer className="text-center mt-8 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} catface rally club</p>
      </footer>
    </div>
  );
};

export default Index;
