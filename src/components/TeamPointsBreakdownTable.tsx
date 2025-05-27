
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamChampionshipEntry } from '@/lib/teamPointsCalculator';
import { Users } from 'lucide-react';
import { slugify } from '@/lib/slugify';

interface TeamPointsBreakdownTableProps {
  standings: TeamChampionshipEntry[];
  eventNames: string[];
}

const TeamPointsBreakdownTable: React.FC<TeamPointsBreakdownTableProps> = ({ standings, eventNames }) => {
  if (!standings || standings.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl text-black flex items-center">
          <Users className="mr-2 h-6 w-6" /> Team championship overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-black font-semibold w-16 sticky left-0 bg-card z-10">Rank</TableHead>
                <TableHead className="text-black font-semibold sticky left-[64px] bg-card z-10 min-w-[150px]">Team Name</TableHead>
                {eventNames.map(eventName => (
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
                <TableRow key={`${entry.teamName}-${entry.rank}`}>
                  <TableCell className="py-3 px-4 font-medium sticky left-0 bg-card z-0">{entry.rank}</TableCell>
                  <TableCell className="py-3 px-4 sticky left-[64px] bg-card z-0">{entry.teamName}</TableCell>
                  {eventNames.map(eventName => (
                    <TableCell key={`${entry.teamName}-${eventName}`} className="py-3 px-4">
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

export default TeamPointsBreakdownTable;
