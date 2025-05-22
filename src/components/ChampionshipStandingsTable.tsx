import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChampionshipEntry } from '@/lib/pointsCalculator'; // This interface now includes pointsPerEvent
import { Trophy } from 'lucide-react';

interface ChampionshipStandingsTableProps {
  standings: ChampionshipEntry[]; // ChampionshipEntry now includes pointsPerEvent
}

const ChampionshipStandingsTable: React.FC<ChampionshipStandingsTableProps> = ({ standings }) => {
  if (!standings || standings.length === 0) {
    return (
      <Card className="bg-dark-charcoal shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-2xl text-bright-blue flex items-center">
            <Trophy className="mr-2 h-6 w-6" /> Championship Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-light-gray">Championship standings are not yet available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-charcoal shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-bright-blue flex items-center">
          <Trophy className="mr-2 h-6 w-6" /> Championship Standings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="text-silver-gray">
          <TableHeader>
            <TableRow className="border-medium-gray hover:bg-mid-gray/20">
              <TableHead className="text-sky-blue font-semibold w-16">Rank</TableHead>
              <TableHead className="text-sky-blue font-semibold">Name</TableHead>
              <TableHead className="text-sky-blue font-semibold">Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((entry) => (
              <TableRow key={`${entry.name}-${entry.rank}`} className="border-medium-gray hover:bg-mid-gray/10">
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
