
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import { fetchTeamData, TeamMembership } from "@/lib/teamData";
import { teamInformation } from "@/lib/teamInfo";
import { FileText, Users } from "lucide-react";
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

        {/* Team Presentations */}
        {!isLoading && !error && teamMembership && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">Active Teams</h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(teamInformation).map(([teamKey, teamInfo]) => {
                // Get current members for this team
                const currentMembers = Object.entries(teamMembership)
                  .filter(([, team]) => team === teamKey)
                  .map(([driver]) => driver);

                // Only show teams that have current members
                if (currentMembers.length === 0) return null;

                return (
                  <div key={teamKey} className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2">{teamInfo.name}</h3>
                        {teamInfo.foundedYear && (
                          <p className="text-sm text-gray-500 mb-2">Founded {teamInfo.foundedYear}</p>
                        )}
                      </div>
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Team Logo</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{teamInfo.description}</p>
                    
                    {teamInfo.philosophy && (
                      <p className="text-sm italic text-gray-600 mb-4">"{teamInfo.philosophy}"</p>
                    )}

                    <div className="mb-4">
                      <h4 className="font-semibold text-black mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Current Members ({currentMembers.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentMembers.map(member => (
                          <span key={member} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>

                    {teamInfo.achievements && (
                      <div>
                        <h4 className="font-semibold text-black mb-2">Notable Achievements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {teamInfo.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
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
