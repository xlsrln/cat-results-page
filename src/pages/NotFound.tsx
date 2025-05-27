
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if we're in an infinite redirect loop
    if (location.search.includes('~and~')) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find that page</p>
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
