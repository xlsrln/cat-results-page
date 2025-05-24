
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchResultsData } from "@/pages/Index";
import { calculateDriverMedals } from "@/lib/medalCounter";
import { MedalTable } from "@/components/MedalTable";
import { Trophy } from "lucide-react";
import Navigation from '@/components/Navigation';

const HallOfFame = () => {
  const { data: eventData, error, isLoading } = useQuery({
    queryKey: ["resultsData"],
    queryFn: fetchResultsData,
  });

  const driverMedals = eventData ? calculateDriverMedals(eventData) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center justify-center">
            <Trophy className="h-10 w-10 mr-3 text-yellow-500" />
            Hall of Fame
          </h1>
          <p className="text-xl text-gray-600">Celebrating the legends of CAT Rally Championship</p>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              Could not load championship data: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading championship data...</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="max-w-6xl mx-auto">
            <MedalTable 
              driverMedals={driverMedals} 
              title="Season 5 Medal Table"
            />
            
            <div className="mt-12 bg-white rounded-lg border p-8">
              <h2 className="text-2xl font-bold text-black mb-4">Championship Legacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The CAT Rally Championship has seen incredible drivers push the limits of what's possible 
                on some of the world's most challenging stages. From the icy roads of Norway to the dusty 
                trails of Kenya, these legends have left their mark on rally history.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Each podium finish represents hours of preparation, split-second decisions, and the 
                unwavering pursuit of perfection. These are the drivers who have defined what it means 
                to be a champion in the CAT Rally Championship.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CAT Rally Championship. All rights reserved.</p>
        </div>
      </footer>
    </div>

#


**Previous Catface AOR World Champions**

Driver's champions:

- Season 1: Proporo
- Season 2: Late
- Season 3: Franky M.
- Season 4: Franky M.

Team champions:

- Season 1: Cat face NoSpace
- Season 2: G2D Racing
- Season 3: G2D Racing
- Season 4: Brick Motorsports

Cool cat of the year:

- 2022: Domer
- 2023: Franky M.

#

**Hall of fame**

| player                                                | trophies | 
| --------------------------------------------------- |  ------- | 
| franky m. | 🏆🏆🥇🥇🥇🥇🥇🥇🥈🥈🥈🥈🥈🥈🥈🥈🥈🥉🥉🥉 |
| proporo | 🏆🥇🥇🥇🥇🥇🥇🥇🥇🥇🥇🥇🥈🥈🥈🥈🥈🥈🥈🥈🥈🥉🥉 | 
| late | 🏆🥇🥇🥇🥇🥇🥇🥇🥈🥉 | 
| radi | 🥇🥇🥈🥈🥈🥉🥉🥉🥉🥉🥉🥉🥉 |
| turbo | 🥇🥈🥉🥉🥉🥉 | 
| wes | 🥇🥈🥉 | 
| playerz | 🥈🥈🥈🥈 | 
| myth | 🥈🥉 | 
| dryout | 🥉🥉🥉 |
| domer | 🥉🥉 | 
| kk | 🥉 | 
| toucan | 🥉 | 
| major clanger | 🥉 |

**Team hall of fame**

| team                                                | trophies | 
| --------------------------------------------------- |  ------- | 
| G2D Racing | 🏆🏆 | 
| Cat Face NoSpace | 🏆 | 
| Brick Motorsports | 🏆 | 


## podium summary

**season 1**

| japan | indonesia | kenya   | germany | sardinia | live event |
|-------|-----------|---------|---------|----------|---------|
| 🥇 wes   | 🥇 proporo   | 🥇 proporo | 🥇 proporo | 🥇 proporo  | 🥇 turbo |
| 🥈 turbo | 🥈 myth      | 🥈 playerz | 🥈 playerz | 🥈 playerz  | 🥈 wes |
| 🥉 kk    | 🥉 wes       | 🥉 turbo   | 🥉 myth    | 🥉 toucan   | 🥉 domer | 

**season 2**

| norway | sardinia | japan   | kenya | germany | finland | indonesia |
|-------|-----------|---------|---------|----------|----------|----------|
| 🥇 late   | 🥇 late   | 🥇 late | 🥇 late | 🥇 late  | 🥇 late  | 🥇 proporo  |
| 🥈 playerz | 🥈 proporo      | 🥈 proporo | 🥈 proporo | 🥈 proporo  | 🥈 proporo  | 🥈 franky m  |
| 🥉 turbo    | 🥉 turbo       | 🥉 franky m   | 🥉 turbo    | 🥉 franky m   | 🥉 dryout | 🥉 dryout |

**season 3**

| norway | germany | 	kenya |	indonesia |	japan |	finland |
|-------|-----------|---------|---------|----------|----------|
| 🥇 late   | 🥇 proporo   | 🥇 proporo | 🥇 franky m | 🥇 franky m  | 🥇 radi  |
| 🥈 proporo | 🥈 franky m      | 🥈 franky m | 🥈 radi | 🥈 radi  | 🥈 franky m  | 
| 🥉 franky m    | 🥉 late       | 🥉 radi   | 🥉 proporo    | 🥉 major clanger   | 🥉 dryout |

**season 4**

| kenya | indonesia | 	germany |	norway |	australia |
|-------|-----------|---------|---------|----------|
| 🥇 franky m   | 🥇 franky m   | 🥇 franky m | 🥇 proporo  | 🥇 franky m |
| 🥈 late | 🥈 radi      | 🥈 proporo | 🥈 franky m | 🥈 proporo |
| 🥉 radi   | 🥉 domer       | 🥉 radi   | 🥉 radi | 🥉 radi |

**season 5**

| scandi flick | night safari | delivery dash |	enduring friendship | long short | x |
|-------|-----------|---------|----|----|----|
| 🥇 proporo   | 🥇 proporo   | 🥇 radi | 🥇 proporo | 🥇 | 🥇 |
| 🥈 franky m | 🥈 franky m      | 🥈 franky m | 🥈 franky m | 🥈 | 🥈 |
| 🥉 radi   | 🥉 radi       | 🥉 proporo   | 🥉 radi | 🥉 | 🥉 |


#

**rally master (multi-game championship)**

| art of rally  | dirt rally 2       | rush rally 3       | richard burns rally  |
|----------------|---------------------|---------------------|-----------------------|
|  🥇 franky    |  🥇 colin mccrack  |  🥇 franky         |  🥇 noEihaOo         |
|  🥈 domer     |  🥈 colorcat       |  🥈 colin mccrack  |  🥈 dryout           |
|  🥉 playerz   |  🥉 nept           |  🥉 nept           |  🥉 colin mccrack    |
    
  );
};

export default HallOfFame;
