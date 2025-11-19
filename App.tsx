import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Create } from './pages/Create';
import { ImageAds } from './pages/ImageAds';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' is the Landing Page
  const [initialInput, setInitialInput] = useState('');

  const handleStartCreate = (input: string = '') => {
    setInitialInput(input);
    setCurrentView('create');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return <Create initialInput={initialInput} />;
      case 'image-ads':
        return <ImageAds />;
      case 'dashboard':
      default:
        return <Home onStartCreate={handleStartCreate} />;
    }
  };

  // Only show sidebar layout when in "App" mode (Create, Projects, etc)
  // Dashboard (Home) gets full width layout
  const isAppMode = currentView !== 'dashboard';

  return (
    <div className="min-h-screen font-sans selection:bg-brand-purple/30 bg-brand-dark text-slate-200">
      
      {/* Header Positioning Logic */}
      <div className={`w-full z-50 ${isAppMode ? 'relative' : 'absolute top-0 left-0 right-0'}`}>
        <Header 
            onMenuClick={() => setIsSidebarOpen(true)} 
            isAppMode={isAppMode}
            onLogoClick={() => setCurrentView('dashboard')}
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