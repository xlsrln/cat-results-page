
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChampionshipEntry } from '@/lib/pointsCalculator';
import { Trophy } from 'lucide-react';

interface ChampionshipStandingsTableProps {
  standings: ChampionshipEntry[];
}

const ChampionshipStandingsTable: React.FC<ChampionshipStandingsTableProps> = ({ standings }) => {
  if (!standings || standings.length === 0) {
    return (
      <Card className="shadow-xl mt-8"> {/* Removed bg-dark-charcoal */}
        <CardHeader>
          <CardTitle className="text-2xl text-bright-blue flex items-center">
            <Trophy className="mr-2 h-6 w-6" /> Championship Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* text-light-gray to text-muted-foreground */}
          <p className="text-muted-foreground">Championship standings are not yet available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl mt-8"> {/* Removed bg-dark-charcoal */}
      <CardHeader>
        <CardTitle className="text-2xl text-bright-blue flex items-center">
          <Trophy className="mr-2 h-6 w-6" /> Championship Standings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Removed text-silver-gray. Theme should handle this */}
        <Table> 
          <TableHeader>
            {/* Removed border-medium-gray, hover:bg-mid-gray/20. Theme should handle this */}
            <TableRow> 
              <TableHead className="text-sky-blue font-semibold w-16">Rank</TableHead>
              <TableHead className="text-sky-blue font-semibold">Name</TableHead>
              <TableHead className="text-sky-blue font-semibold">Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((entry) => (
              // Removed border-medium-gray, hover:bg-mid-gray/10. Theme should handle this
              <TableRow key={`${entry.name}-${entry.rank}`}> 
                <TableCell className="py-3 px-4 font-medium">{entry.rank}</TableCell>
                <TableCell className="py-3 px-4">{entry.name}</TableCell>
                <TableCell className="py-3 px-4">{entry.totalPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ChampionshipStandingsTable;
