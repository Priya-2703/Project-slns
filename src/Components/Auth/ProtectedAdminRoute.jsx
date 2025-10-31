import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// ⭐ Protected Route Component for Admin Only
export default function ProtectedAdminRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // If no token or user data, redirect to sign in
    if (!token || !userStr) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Check if user has admin role
      if (user.role === 'admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font2">Verifying access...</div>
      </div>
    );
  }

  // Redirect unauthorized users
  // if (!isAuthorized) {
  //   return <Navigate to="/signin" replace />;
  // }

  // Render admin content for authorized users
  return children;
}

// ⭐ Optional: Redirect admin users away from regular pages
export function RedirectIfAdmin({ children }) {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          setShouldRedirect(true);
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}