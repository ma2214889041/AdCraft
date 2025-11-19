import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Create } from './pages/Create';
import { ImageAds } from './pages/ImageAds';
import { onAuthChange } from './services/authService';
import type { User } from 'firebase/auth';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // Default to Landing Page
  const [initialInput, setInitialInput] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      // If user logs out, redirect to landing
      if (!currentUser && currentView !== 'landing') {
        setCurrentView('landing');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentView]);

  // When starting from the landing page, go to Dashboard (simulating login)
  // or directly to create if an input was provided
  const handleStartCreate = (input: string = '') => {
    setInitialInput(input);
    if (input) {
        setCurrentView('create');
    } else {
        setCurrentView('dashboard');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'create':
        return <Create initialInput={initialInput} />;
      case 'image-ads':
        return <ImageAds />;
      case 'landing':
      default:
        return <Home onStartCreate={handleStartCreate} />;
    }
  };

  // "App Mode" (Sidebar + Logged In Header) applies to everything except the Landing Page
  const isAppMode = currentView !== 'landing';

  return (
    <div className="min-h-screen font-sans selection:bg-brand-purple/30 bg-brand-dark text-slate-200">
      
      {/* Header Positioning Logic */}
      <div className={`w-full z-50 ${isAppMode ? 'relative' : 'absolute top-0 left-0 right-0'}`}>
        <Header 
            onMenuClick={() => setIsSidebarOpen(true)} 
            isAppMode={isAppMode}
            // If in app mode, clicking logo goes to dashboard. If in landing, it refreshes landing.
            onLogoClick={() => setCurrentView(isAppMode ? 'dashboard' : 'landing')}
        />
      </div>
      
      <div className={`flex overflow-hidden relative ${isAppMode ? 'h-[calc(100vh-6rem)]' : 'min-h-screen'}`}>
        {isAppMode && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        )}
        
        <main className={`flex-1 overflow-y-auto relative scroll-smooth ${isAppMode ? '' : 'w-full'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;