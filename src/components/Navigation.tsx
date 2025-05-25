
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-black">
            CAT Rally Championship
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base">
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-black font-medium text-base">
                  Results
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50"> 
                  <div className="grid w-[400px] gap-3 p-4">
                    <Link 
                      to="/results" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Current Season</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Season 5 standings and results
                      </p>
                    </Link>
                    <Link 
                      to="/hall-of-fame" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Hall of Fame</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Medal table and championship legends
                      </p>
                    </Link>
                    <Link 
                      to="/all-time-stats" 
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">All-Time Stats</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Aggregate championship medals across all seasons
                      </p>
                    </Link>
                    <div className="border-t pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Previous Seasons & Events</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Link 
                          to="/season-1" 
                          className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                        >
                          Season 1
                        </Link>
                        <Link 
                          to="/season-2" 
                          className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                        >
                          Season 2
                        </Link>
                        <Link 
                          to="/season-3" 
                          className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                        >
                          Season 3
                        </Link>
                        <Link 
                          to="/season-4" 
                          className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                        >
                          Season 4
                        </Link>
                        <Link 
                          to="/season-5" 
                          className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                        >
                          Season 5
                        </Link>
                        <Link 
                          to="/rally-master" 
                          className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                        >
                          Rally Master
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/teams" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base">
                  Teams
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/stages" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base">
                  Stages
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/rules" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base">
                  Rules
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
