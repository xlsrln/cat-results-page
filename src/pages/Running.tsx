import React from 'react';
import { Link } from 'react-router-dom';
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import runContent from "../content/run.md?raw";
import Navigation from '@/components/Navigation';

const Running = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Catface Running Club</h1>
          <p className="text-xl text-gray-600">A club for everyone</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer content={runContent} />
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

export default Running;
