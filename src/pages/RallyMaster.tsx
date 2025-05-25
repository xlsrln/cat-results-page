
import React from 'react';
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import rallyMasterContent from "../content/seasons/rally-master.md?raw";
import Navigation from '@/components/Navigation';

const RallyMaster = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center">Rally Master</h1>
          <p className="text-xl text-center text-gray-600 mt-2">Elite Championship Series</p>
        </header>
        
        <div className="max-w-4xl mx-auto prose dark:prose-invert">
          <MarkdownRenderer content={rallyMasterContent} />
        </div>
      </div>
      
      <footer className="bg-gray-50 border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CAT Rally Championship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RallyMaster;
