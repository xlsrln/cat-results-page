
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChampionshipEntry } from '@/lib/pointsCalculator'; // Uses the updated interface
import { Trophy } from 'lucide-react';

interface PointsBreakdownTableProps {
  standings: ChampionshipEntry[];
  eventNames: string[]; // To dynamically create columns for each event
}

const PointsBreakdownTable: React.FC<PointsBreakdownTableProps> = ({ standings, eventNames }) => {
  if (!standings || standings.length === 0) {
    return null; // Or a message like "No standings data available for breakdown."
  }

  // Sort event names alphabetically for consistent column order
  const sortedEventNames = [...eventNames].sort((a, b) => a.localeCompare(b));

  return (
    <Card className="bg-dark-charcoal shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-bright-blue flex items-center">
          <Trophy className="mr-2 h-6 w-6" /> Points Breakdown per Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto"> {/* Added for horizontal scrolling on small screens */}
          <Table className="text-silver-gray min-w-[800px]"> {/* min-w to encourage scrolling if needed */}
            <TableHeader>
              <TableRow className="border-medium-gray hover:bg-mid-gray/20">
                <TableHead className="text-sky-blue font-semibold w-16 sticky left-0 bg-dark-charcoal z-10">Rank</TableHead>
                <TableHead className="text-sky-blue font-semibold sticky left-[64px] bg-dark-charcoal z-10 min-w-[150px]">Name</TableHead>
                {sortedEventNames.map(eventName => (
                  <TableHead key={eventName} className="text-sky-blue font-semibold min-w-[120px]">{eventName}</TableHead>
                ))}
                <TableHead className="text-sky-blue font-semibold min-w-[100px] sticky right-0 bg-dark-charcoal z-10">Total Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((entry) => (
                <TableRow key={`${entry.name}-${entry.rank}`} className="border-medium-gray hover:bg-mid-gray/10">
                  <TableCell className="py-3 px-4 font-medium sticky left-0 bg-dark-charcoal z-0">{entry.rank}</TableCell>
                  <TableCell className="py-3 px-4 sticky left-[64px] bg-dark-charcoal z-0">{entry.name}</TableCell>
                  {sortedEventNames.map(eventName => (
                    <TableCell key={`${entry.name}-${eventName}`} className="py-3 px-4">
                      {entry.pointsPerEvent[eventName] || 0}
                    </TableCell>
                  ))}
                  <TableCell className="py-3 px-4 font-medium sticky right-0 bg-dark-charcoal z-0">{entry.totalPoints}</TableCell>
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
