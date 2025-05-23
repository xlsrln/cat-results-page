
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import { Trophy, Users, FileText, BarChart3 } from "lucide-react";
import homeContent from "../content/home.md?raw";

const Home = () => {
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">CAT Rally Championship</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The premier virtual rally racing series bringing together the world's best drivers
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/results">View Current Standings</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/rules">Learn How to Join</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">Current Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">View live championship standings and event results</p>
              <Button asChild className="w-full">
                <Link to="/results">View Results</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">Teams</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Discover teams and their talented drivers</p>
              <Button asChild className="w-full">
                <Link to="/teams">Browse Teams</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-lg">Rules</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Championship regulations and participation guide</p>
              <Button asChild className="w-full">
                <Link to="/rules">Read Rules</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <CardTitle className="text-lg">Hall of Fame</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Champions and record holders throughout history</p>
              <Button asChild className="w-full">
                <Link to="/#hall-of-fame">View Champions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer content={homeContent} />
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
