
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Medal, Trophy } from "lucide-react"; // Added Trophy
import { DriverMedals } from "@/lib/medalCounter";

interface MedalTableProps {
  driverMedals: DriverMedals[];
  title?: string;
  championshipsByDriver?: Record<string, number>; // Added for championships
}

export const MedalTable: React.FC<MedalTableProps> = ({ driverMedals, title = "Medal Table", championshipsByDriver }) => {
  // Combine driver data with championships for sorting if championships are primary sort criteria (optional)
  // For now, we sort by total medals, then gold, silver, bronze, then championships.
  // If championshipsByDriver is undefined or empty, it means no championship data available or needed for this instance of the table.

  const enrichedDriverMedals = driverMedals.map(driver => ({
    ...driver,
    championships: championshipsByDriver?.[driver.name] || 0,
  })).sort((a, b) => {
    if (b.championships !== a.championships) {
      return b.championships - a.championships;
    }
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    if (b.medals.gold !== a.medals.gold) {
      return b.medals.gold - a.medals.gold;
    }
    if (b.medals.silver !== a.medals.silver) {
      return b.medals.silver - a.medals.silver;
    }
    return b.medals.bronze - a.medals.bronze;
  });


  if (enrichedDriverMedals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No driver medal or championship data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-black flex items-center">
        <Medal className="h-5 w-5 mr-2 text-yellow-500" /> {/* Using Medal for overall table title icon */}
        {title}
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Rank</TableHead>
              <TableHead className="font-semibold">Driver</TableHead>
              <TableHead className="font-semibold text-center">
                <Trophy className="inline-block h-5 w-5 text-amber-400" /> {/* Trophy icon for Championship header */}
              </TableHead>
              <TableHead className="font-semibold text-center">🥇</TableHead>
              <TableHead className="font-semibold text-center">🥈</TableHead>
              <TableHead className="font-semibold text-center">🥉</TableHead>
              <TableHead className="font-semibold text-center">Total Medals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedDriverMedals.map((driver, index) => (
              <TableRow key={driver.name}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell className="text-center font-medium">
                  {driver.championships > 0 ? driver.championships : '-'}
                </TableCell>
                <TableCell className="text-center">{driver.medals.gold || '-'}</TableCell>
                <TableCell className="text-center">{driver.medals.silver || '-'}</TableCell>
                <TableCell className="text-center">{driver.medals.bronze || '-'}</TableCell>
                <TableCell className="text-center font-semibold">{driver.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
