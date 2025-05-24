
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import { fetchTeamData, TeamMembership } from "@/lib/teamData";
import { teamInformation } from "@/lib/teamInfo"; // TeamInfo type is also implicitly imported if used from here
import { FileText, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import teamsContent from "../content/teams.md?raw";

const Teams = () => {
  const { data: teamMembership, error, isLoading: isLoadingTeamMembership } = useQuery<TeamMembership, Error>({
    queryKey: ["teamData"],
    queryFn: fetchTeamData,
  });

  const allTeamKeys = React.useMemo(() => {
    if (!teamMembership) return [];
    // Get unique team names from the teamMembership data
    return Array.from(new Set(Object.values(teamMembership)));
  }, [teamMembership]);

  // Determine overall loading state
  const isLoading = isLoadingTeamMembership;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

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
        
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading team data...</p>
            {/* Consider adding some skeletons here for better UX */}
          </div>
        )}

        {/* Team Presentations */}
        {!isLoading && !error && allTeamKeys.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">Team Profiles</h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {allTeamKeys.map((teamKey) => {
                const teamInfo = teamInformation[teamKey]; // teamKey is the actual team name from CSV
                
                const currentMembers = teamMembership
                  ? Object.entries(teamMembership)
                      .filter(([, team]) => team === teamKey)
                      .map(([driver]) => driver)
                  : [];

                const displayName = teamInfo?.name || teamKey;
                const description = teamInfo?.description || "No detailed profile available for this team.";
                const foundedYear = teamInfo?.foundedYear;
                const philosophy = teamInfo?.philosophy;
                const achievements = teamInfo?.achievements;

                return (
                  <div key={teamKey} className="bg-white border rounded-lg p-6 shadow-sm flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2">{displayName}</h3>
                        {foundedYear && (
                          <p className="text-sm text-gray-500 mb-2">Founded {foundedYear}</p>
                        )}
                      </div>
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <span className="text-gray-400 text-xs">Team Logo</span> {/* Placeholder */}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed flex-grow">{description}</p>
                    
                    {philosophy && (
                      <p className="text-sm italic text-gray-600 mb-4">"{philosophy}"</p>
                    )}

                    {currentMembers.length > 0 && (
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
                    )}

                    {achievements && achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-black mb-2">Notable Achievements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {achievements.map((achievement, idx) => (
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
        
        {!isLoading && !error && allTeamKeys.length === 0 && teamMembership && (
           <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>No Teams Found</AlertTitle>
            <AlertDescription>
              Team data was loaded, but no teams could be identified. Please check your team data source.
            </AlertDescription>
          </Alert>
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
