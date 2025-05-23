
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import { fetchTeamData, TeamMembership } from "@/lib/teamData";
import { FileText } from "lucide-react";
import teamsContent from "../content/teams.md?raw";

const Teams = () => {
  const { data: teamMembership, error, isLoading } = useQuery<TeamMembership, Error>({
    queryKey: ["teamData"],
    queryFn: fetchTeamData,
  });

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
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Championship Teams</h1>
          <p className="text-xl text-gray-600">Meet the teams competing for glory</p>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <FileText className="h-4 w-4" />
            <AlertTitle>Error Loading Team Data</AlertTitle>
            <AlertDescription>
              Could not load team information: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Active Teams */}
        {!isLoading && !error && teamMembership && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">Current Active Teams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(
                Object.values(teamMembership).reduce((acc, team) => {
                  acc[team] = (acc[team] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([teamName, memberCount]) => (
                <div key={teamName} className="bg-white border rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-black mb-2">{teamName}</h3>
                  <p className="text-gray-600 mb-3">
                    Active team with {memberCount} registered driver{memberCount !== 1 ? 's' : ''}
                  </p>
                  <div className="text-sm text-gray-500">
                    <strong>Members:</strong>{' '}
                    {Object.entries(teamMembership)
                      .filter(([, team]) => team === teamName)
                      .map(([driver]) => driver)
                      .join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content from markdown */}
        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer content={teamsContent} />
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

export default Teams;
