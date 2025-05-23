
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamChampionshipEntry } from '@/lib/teamPointsCalculator';
import { Users } from 'lucide-react';

interface TeamChampionshipStandingsTableProps {
  standings: TeamChampionshipEntry[];
}

const TeamChampionshipStandingsTable: React.FC<TeamChampionshipStandingsTableProps> = ({ standings }) => {
  if (!standings || standings.length === 0) {
    return (
      <Card className="shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-2xl text-black flex items-center">
            <Users className="mr-2 h-6 w-6" /> Team Championship Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Team championship standings are not yet available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-black flex items-center">
          <Users className="mr-2 h-6 w-6" /> Team Championship Standings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold w-16">Rank</TableHead>
              <TableHead className="text-black font-semibold">Team Name</TableHead>
              <TableHead className="text-black font-semibold">Total Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((entry) => (
              <TableRow key={`${entry.teamName}-${entry.rank}`}>
                <TableCell className="py-3 px-4 font-medium">{entry.rank}</TableCell>
                <TableCell className="py-3 px-4">{entry.teamName}</TableCell>
                <TableCell className="py-3 px-4">{entry.totalPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamChampionshipStandingsTable;
