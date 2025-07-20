
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Re-usable ListItem component for NavigationMenu
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; children: React.ReactNode }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <Link
        to={to}
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";


const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-black">
            Catface Rally Club
          </Link>
          
          {/* Mobile menu button */}
          {isMobile ? (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                 <Link to="/" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-black font-medium text-base data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                  Results
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50"> 
                  <ul className="grid w-[400px] gap-3 p-4"> {/* Changed div to ul for ListItem */}
                    {/*  todo remove this
                    <ListItem to="/results" title="Current Season">
                      Season 5 standings and results
                    </ListItem>
                    */}
                    <ListItem to="/hall-of-fame" title="Hall of Fame">
                       Driver medals, championships, and team accolades
                    </ListItem>
                    <div className="border-t pt-3 mt-2"> {/* Added mt-2 for spacing */}
                      <p className="text-xs text-muted-foreground px-3 mb-2">Previous Seasons & Events</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { to: "/season-1", label: "Season 1" },
                          { to: "/season-2", label: "Season 2" },
                          { to: "/season-3", label: "Season 3" },
                          { to: "/season-4", label: "Season 4" },
                          { to: "/season-5", label: "Season 5" },
                          { to: "/rally-master", label: "Rally Master" },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm text-center"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/teams" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                  Teams
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                 <Link to="/stages" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                  Stages
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/rules" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                  Rules
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/running" className="text-gray-700 hover:text-black font-medium px-4 py-2 text-base inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                  Running
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          )}
        </div>
        
        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pb-4 border-t">
            <div className="flex flex-col space-y-2 pt-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-900 mb-2">Results</p>
                <div className="ml-4 space-y-1">
                  <Link 
                    to="/hall-of-fame" 
                    className="block text-gray-600 hover:text-black py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hall of Fame
                  </Link>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mt-2 mb-1">Previous Seasons</p>
                    {[
                      { to: "/season-1", label: "Season 1" },
                      { to: "/season-2", label: "Season 2" },
                      { to: "/season-3", label: "Season 3" },
                      { to: "/season-4", label: "Season 4" },
                      { to: "/season-5", label: "Season 5" },
                      { to: "/rally-master", label: "Rally Master" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block text-gray-600 hover:text-black py-1 text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link 
                to="/teams" 
                className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Teams
              </Link>
              
              <Link 
                to="/stages" 
                className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stages
              </Link>
              
              <Link 
                to="/rules" 
                className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rules
              </Link>
              
              <Link 
                to="/running" 
                className="text-gray-700 hover:text-black font-medium px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Running
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
