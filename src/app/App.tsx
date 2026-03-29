import { useState, useEffect } from 'react';
import { PremiumFeedbackForm } from './components/pages/PremiumFeedbackForm';
import { PremiumLogin } from './components/pages/PremiumLogin';
import { PremiumDashboard } from './components/pages/PremiumDashboard';
import { ThemeProvider } from './components/ThemeProvider';
import { apiService } from './services/api.service';
import { Toaster } from 'sonner';

type Route = 'feedback' | 'login' | 'dashboard';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('feedback');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(apiService.isAuthenticated());

    // Handle hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'login') {
        setCurrentRoute('login');
      } else if (hash === 'dashboard') {
        if (apiService.isAuthenticated()) {
          setCurrentRoute('dashboard');
        } else {
          setCurrentRoute('login');
        }
      } else {
        setCurrentRoute('feedback');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentRoute('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setCurrentRoute('feedback');
    window.location.hash = '';
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        {currentRoute === 'feedback' && <PremiumFeedbackForm />}
        {currentRoute === 'login' && <PremiumLogin onLoginSuccess={handleLoginSuccess} />}
        {currentRoute === 'dashboard' && <PremiumDashboard onLogout={handleLogout} />}
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}