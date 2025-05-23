
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import { fetchTeamData, TeamMembership } from "@/lib/teamData";
import { Users, Trophy, FileText } from "lucide-react";
import teamsContent from "../content/teams.md?raw";

const Teams = () => {
  const { data: teamMembership, error, isLoading } = useQuery<TeamMembership, Error>({
    queryKey: ["teamData"],
    queryFn: fetchTeamData,
  });

  // Process team data to group members by team
  const teamGroups = React.useMemo(() => {
    if (!teamMembership) return {};
    
    const groups: Record<string, string[]> = {};
    Object.entries(teamMembership).forEach(([driverName, teamName]) => {
      if (!groups[teamName]) {
        groups[teamName] = [];
      }
      groups[teamName].push(driverName);
    });
    
    return groups;
  }, [teamMembership]);

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

        {/* Team Cards */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-8">
            <FileText className="h-4 w-4" />
            <AlertTitle>Error Loading Team Data</AlertTitle>
            <AlertDescription>
              Could not load team information: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && Object.keys(teamGroups).length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.entries(teamGroups).map(([teamName, members]) => (
              <Card key={teamName} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-black flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                      {teamName}
                    </CardTitle>
                    <Badge variant="secondary" className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {members.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Placeholder team image */}
                  <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{teamName}</span>
                  </div>
                  
                  {/* Placeholder description */}
                  <p className="text-gray-600 mb-4 text-sm">
                    {teamName} is a competitive rally team focused on excellence and teamwork. 
                    They bring together skilled drivers who work collaboratively to achieve 
                    championship success through strategic racing and mutual support.
                  </p>
                  
                  {/* Team members */}
                  <div className="space-y-1">
                    <p className="font-semibold text-black text-sm">Team Members:</p>
                    <div className="flex flex-wrap gap-1">
                      {members.map((member) => (
                        <Badge key={member} variant="outline" className="text-xs">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
