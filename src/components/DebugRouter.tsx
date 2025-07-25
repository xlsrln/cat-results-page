import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DebugRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[DebugRouter] Component mounted');
    console.log('[DebugRouter] Initial window.location:', window.location.href);
    console.log('[DebugRouter] Initial React Router location:', location);
    
    // Handle GitHub Pages redirect if we have the ?p= parameter
    const params = new URLSearchParams(location.search);
    const pathParam = params.get('p');
    const queryParam = params.get('q');
    
    if (pathParam && location.pathname === '/') {
      console.log('[DebugRouter] Found GitHub Pages redirect params');
      console.log('[DebugRouter] pathParam:', pathParam);
      console.log('[DebugRouter] queryParam:', queryParam);
      
      const newPath = decodeURIComponent(pathParam);
      const newSearch = queryParam ? '?' + decodeURIComponent(queryParam) : '';
      const newHash = location.hash;
      
      console.log('[DebugRouter] Navigating to:', newPath + newSearch + newHash);
      navigate(newPath + newSearch + newHash, { replace: true });
    }
  }, []);

  useEffect(() => {
    console.log('[DebugRouter] React Router location changed');
    console.log('[DebugRouter] Current location:', window.location.href);
    console.log('[DebugRouter] React Router location:', location);
    console.log('[DebugRouter] Pathname:', location.pathname);
    console.log('[DebugRouter] Search:', location.search);
    console.log('[DebugRouter] Hash:', location.hash);
  }, [location]);

  return null;
};

export default DebugRouter;