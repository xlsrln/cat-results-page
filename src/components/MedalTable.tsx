
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Medal } from "lucide-react";
import { DriverMedals } from "@/lib/medalCounter";

interface MedalTableProps {
  driverMedals: DriverMedals[];
  title?: string;
}

export const MedalTable: React.FC<MedalTableProps> = ({ driverMedals, title = "Medal Table" }) => {
  if (driverMedals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No medal data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-black flex items-center">
        <Medal className="h-5 w-5 mr-2 text-yellow-500" />
        {title}
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Rank</TableHead>
              <TableHead className="font-semibold">Driver</TableHead>
              <TableHead className="font-semibold text-center">🥇</TableHead>
              <TableHead className="font-semibold text-center">🥈</TableHead>
              <TableHead className="font-semibold text-center">🥉</TableHead>
              <TableHead className="font-semibold text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverMedals.map((driver, index) => (
              <TableRow key={driver.name}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{driver.name}</TableCell>
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
