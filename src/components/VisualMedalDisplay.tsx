
import React from 'react';
import { Trophy } from "lucide-react";
import { DriverMedals } from "@/lib/medalCounter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VisualMedalDisplayProps {
  driverMedals: DriverMedals[];
  title?: string;
  championshipsByDriver?: Record<string, number>;
}

export const VisualMedalDisplay: React.FC<VisualMedalDisplayProps> = ({ 
  driverMedals, 
  title = "Visual Medal Display", 
  championshipsByDriver 
}) => {
  // Sort drivers the same way as the main medal table
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
        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
        {title}
      </h3>
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Medals & Championships</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedDriverMedals.map((driver, index) => (
              <TableRow key={driver.name}>
                <TableCell className="font-medium text-gray-500">
                  {index + 1}
                </TableCell>
                <TableCell className="font-semibold text-black">
                  {driver.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Championships */}
                    {Array.from({ length: driver.championships }).map((_, i) => (
                      <span key={`championship-${i}`} className="text-lg">🏆</span>
                    ))}
                    
                    {/* Gold medals */}
                    {Array.from({ length: driver.medals.gold }).map((_, i) => (
                      <span key={`gold-${i}`} className="text-lg">🥇</span>
                    ))}
                    
                    {/* Silver medals */}
                    {Array.from({ length: driver.medals.silver }).map((_, i) => (
                      <span key={`silver-${i}`} className="text-lg">🥈</span>
                    ))}
                    
                    {/* Bronze medals */}
                    {Array.from({ length: driver.medals.bronze }).map((_, i) => (
                      <span key={`bronze-${i}`} className="text-lg">🥉</span>
                    ))}
                    
                    {/* Show message if no medals */}
                    {driver.total === 0 && driver.championships === 0 && (
                      <span className="text-gray-400 italic text-sm">No medals yet</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
