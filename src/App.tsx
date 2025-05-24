import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Teams from "./pages/Teams";
import Rules from "./pages/Rules";
import Stages from "./pages/Stages";
import Season1 from "./pages/Season1";
import Season2 from "./pages/Season2";
import Season3 from "./pages/Season3";
import Season4 from "./pages/Season4";
import HallOfFame from "./pages/HallOfFame";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/stages" element={<Stages />} />
            <Route path="/season-1" element={<Season1 />} />
            <Route path="/season-2" element={<Season2 />} />
            <Route path="/season-3" element={<Season3 />} />
            <Route path="/season-4" element={<Season4 />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
