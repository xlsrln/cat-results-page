
import React from 'react';
import { Trophy } from "lucide-react";
import { DriverMedals } from "@/lib/medalCounter";

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
      <div className="space-y-4">
        {enrichedDriverMedals.map((driver, index) => (
          <div key={driver.name} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                <span className="text-lg font-bold text-black">{driver.name}</span>
              </div>
              <span className="text-sm text-gray-600">Total: {driver.total} medals</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-1">
              {/* Championships */}
              {Array.from({ length: driver.championships }).map((_, i) => (
                <span key={`championship-${i}`} className="text-xl">🏆</span>
              ))}
              
              {/* Gold medals */}
              {Array.from({ length: driver.medals.gold }).map((_, i) => (
                <span key={`gold-${i}`} className="text-xl">🥇</span>
              ))}
              
              {/* Silver medals */}
              {Array.from({ length: driver.medals.silver }).map((_, i) => (
                <span key={`silver-${i}`} className="text-xl">🥈</span>
              ))}
              
              {/* Bronze medals */}
              {Array.from({ length: driver.medals.bronze }).map((_, i) => (
                <span key={`bronze-${i}`} className="text-xl">🥉</span>
              ))}
              
              {/* Show message if no medals */}
              {driver.total === 0 && driver.championships === 0 && (
                <span className="text-gray-400 italic">No medals yet</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
