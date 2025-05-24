
import React from 'react';
import { Link } from 'react-router-dom';
import { MarkdownRenderer } from "@/lib/markdownRenderer";
import stagesContent from "../content/stages.md?raw";
import Navigation from '@/components/Navigation';

const Stages = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <MarkdownRenderer content={stagesContent} />
      </div>

      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CAT Rally Championship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Stages;
