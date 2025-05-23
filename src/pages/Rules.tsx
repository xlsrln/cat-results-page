
import React from 'react';
import { Link } from 'react-router-dom';
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import rulesContent from "../content/rules.md?raw";

const Rules = () => {
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
          <h1 className="text-4xl font-bold text-black mb-2">Championship Rules</h1>
          <p className="text-xl text-gray-600">Official regulations and guidelines</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer content={rulesContent} />
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

export default Rules;
