
import React from 'react';
import Navigation from '@/components/Navigation';
import Index from './Index';

const Results = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {/* Results content from Index component */}
      <Index />
    </div>
  );
};

export default Results;
