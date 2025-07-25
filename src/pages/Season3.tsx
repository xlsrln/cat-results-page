
import React from 'react';
import Navigation from '@/components/Navigation';
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import season3Content from "../content/seasons/season-3.md?raw";

const Season3 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Season 3 Results</h1>
          <p className="text-xl text-gray-600">Complete championship standings and results</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <MarkdownRenderer content={season3Content} />
        </div>
      </div>

      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} catface. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Season3;
