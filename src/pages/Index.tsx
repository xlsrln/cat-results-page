
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { parseCSV } from "@/lib/csvParser";
import { FileText } from "lucide-react";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvpxG6EchgG9RszhPdZwv8-ZkHSRo9zxu7moy6t4Nbvg0-Sxi9h7sazU4PdR0lP8T8c5NkFYNgHtL9/pub?output=csv";

interface TournamentData {
  [key: string]: string;
}

const fetchTournamentData = async (): Promise<TournamentData[]> => {
  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const csvText = await response.text();
  return parseCSV(csvText);
};

const Index = () => {
  const { data, error, isLoading } = useQuery<TournamentData[], Error>({
    queryKey: ["tournamentData"],
    queryFn: fetchTournamentData,
  });

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="min-h-screen bg-charcoal-gray text-pure-white p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-bright-blue mb-2">Tournament Standings</h1>
        <p className="text-xl text-light-gray">Live results from the championship</p>
      </header>

      <main className="container mx-auto bg-dark-charcoal p-6 rounded-lg shadow-xl">
        {isLoading && (
          <div>
            <Skeleton className="h-12 w-full mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full mb-2" />
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="bg-destructive/20 border-destructive text-destructive-foreground">
            <FileText className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>
              There was a problem fetching the tournament data: {error.message}. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        {data && data.length > 0 && (
          <Table className="text-silver-gray">
            <TableHeader>
              <TableRow className="border-medium-gray hover:bg-mid-gray/20">
                {headers.map((header) => (
                  <TableHead key={header} className="text-sky-blue font-semibold">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-medium-gray hover:bg-mid-gray/10">
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`} className="py-3 px-4">{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {data && data.length === 0 && (
           <Alert className="bg-dark-gray/50 border-medium-gray">
            <FileText className="h-4 w-4 text-sky-blue" />
            <AlertTitle className="text-sky-blue">No Data Available</AlertTitle>
            <AlertDescription className="text-light-gray">
              The tournament data sheet appears to be empty or could not be parsed correctly.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <footer className="text-center mt-8 text-medium-gray text-sm">
        <p>&copy; {new Date().getFullYear()} Tourney Sheet Champ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
