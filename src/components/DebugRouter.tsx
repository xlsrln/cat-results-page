import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DebugRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[DebugRouter] React Router initialized');
    console.log('[DebugRouter] Current location:', window.location.href);
    console.log('[DebugRouter] React Router location:', location);
    console.log('[DebugRouter] Pathname:', location.pathname);
    console.log('[DebugRouter] Search:', location.search);
    console.log('[DebugRouter] Hash:', location.hash);
  }, [location]);

  useEffect(() => {
    // Log when the component mounts
    console.log('[DebugRouter] Component mounted');
    console.log('[DebugRouter] Initial window.location:', window.location.href);
    console.log('[DebugRouter] Initial React Router location:', location);
  }, []);

  return null;
};

export default DebugRouter;