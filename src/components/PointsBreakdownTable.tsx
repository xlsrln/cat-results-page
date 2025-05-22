
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChampionshipEntry } from '@/lib/pointsCalculator';
import { Trophy } from 'lucide-react';
import { slugify } from '@/lib/slugify'; // Added import

interface PointsBreakdownTableProps {
  standings: ChampionshipEntry[];
  eventNames: string[]; // Now expects chronologically sorted event names (oldest to newest)
}

const PointsBreakdownTable: React.FC<PointsBreakdownTableProps> = ({ standings, eventNames }) => {
  if (!standings || standings.length === 0) {
    return null;
  }

  // Removed: const sortedEventNames = [...eventNames].sort((a, b) => a.localeCompare(b));
  // eventNames prop is now expected to be pre-sorted chronologically.

  return (
    <Card className="shadow-xl mt-8"> {/* Removed bg-dark-charcoal */}
      <CardHeader>
        <CardTitle className="text-2xl text-black flex items-center">
          <Trophy className="mr-2 h-6 w-6" /> Points Breakdown per Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          {/* Removed text-silver-gray. min-w to encourage scrolling if needed */}
          <Table className="min-w-[800px]"> 
            <TableHeader>
              {/* Removed border-medium-gray, hover:bg-mid-gray/20. Theme should handle this */}
              <TableRow> 
                {/* Sticky cells now use bg-card for theme consistency */}
                <TableHead className="text-black font-semibold w-16 sticky left-0 bg-card z-10">Rank</TableHead>
                <TableHead className="text-black font-semibold sticky left-[64px] bg-card z-10 min-w-[150px]">Name</TableHead>
                {eventNames.map(eventName => ( // Use eventNames directly
                  <TableHead key={eventName} className="text-black font-semibold min-w-[120px]">
                    <a href={`#${slugify(eventName)}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-sky-blue rounded">
                      {eventName}
                    </a>
                  </TableHead>
                ))}
                <TableHead className="text-black font-semibold min-w-[100px] sticky right-0 bg-card z-10">Total Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((entry) => (
                // Removed border-medium-gray, hover:bg-mid-gray/10. Theme should handle this
                <TableRow key={`${entry.name}-${entry.rank}`}> 
                  {/* Sticky cells now use bg-card. Kept z-0 as original, might need review if layering issues occur. */}
                  <TableCell className="py-3 px-4 font-medium sticky left-0 bg-card z-0">{entry.rank}</TableCell>
                  <TableCell className="py-3 px-4 sticky left-[64px] bg-card z-0">{entry.name}</TableCell>
                  {eventNames.map(eventName => ( // Use eventNames directly
                    <TableCell key={`${entry.name}-${eventName}`} className="py-3 px-4">
                      {entry.pointsPerEvent[eventName] || 0}
                    </TableCell>
                  ))}
                  <TableCell className="py-3 px-4 font-medium sticky right-0 bg-card z-0">{entry.totalPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsBreakdownTable;
