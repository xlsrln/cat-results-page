
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import { MedalTable } from "@/components/MedalTable";
import { calculateDriverMedals } from "@/lib/medalCounter";
import { fetchResultsData, EventLeaderboard } from "@/pages/Index";
import homeContent from "../content/home.md?raw";

const Home = () => {
  const { data: resultsData, isLoading } = useQuery<EventLeaderboard[], Error>({
    queryKey: ["resultsData"],
    queryFn: fetchResultsData,
  });

  // Calculate medal table from current season
  const driverMedals = React.useMemo(() => {
    if (!resultsData || !Array.isArray(resultsData)) return [];
    return calculateDriverMedals(resultsData);
  }, [resultsData]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-black">
              CAT Rally Championship
            </Link>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-black font-medium">
                Home
              </Link>
              <Link to="/results" className="text-gray-700 hover:text-black font-medium">
                Results
              </Link>
              <Link to="/teams" className="text-gray-700 hover:text-black font-medium">
                Teams
              </Link>
              <Link to="/stages" className="text-gray-700 hover:text-black font-medium">
                Stages
              </Link>
              <Link to="/rules" className="text-gray-700 hover:text-black font-medium">
                Rules
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Content from markdown */}
        <div className="max-w-4xl mx-auto mb-12">
          <MarkdownRenderer content={homeContent} />
        </div>

        {/* Current Season Medal Table */}
        {!isLoading && driverMedals.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <MedalTable 
              driverMedals={driverMedals} 
              title="Current Season Medal Table" 
            />
          </div>
        )}

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              to="/results" 
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-black mb-2">Current Season Results</h3>
              <p className="text-gray-600">View championship standings and event results</p>
            </Link>
            <Link 
              to="/stages" 
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-black mb-2">Rally Stages</h3>
              <p className="text-gray-600">Check out the itineraries for this season's rallies</p>
            </Link>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2">Previous Seasons</h3>
              <p className="text-gray-600 mb-3">Browse results from past championships</p>
              <div className="space-y-1">
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">Season 4 Results</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">Season 3 Results</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">Season 2 Results</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">Season 1 Results</a>
              </div>
            </div>
            <Link 
              to="/teams" 
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-black mb-2">Championship Teams</h3>
              <p className="text-gray-600">Meet the teams competing for glory</p>
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CAT Rally Championship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
