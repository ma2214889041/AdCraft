import React from 'react';
import { LayoutDashboard, PlusCircle, Film, Settings, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Video Creator', icon: Film },
    { id: 'image-ads', label: 'Image Ads', icon: ImageIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#020617] border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 flex items-center justify-between lg:hidden">
           <span className="font-bold text-lg text-white">Menu</span>
           <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onViewChange(item.id); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${currentView === item.id 
                  ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
             <div className="p-4 rounded-xl bg-gradient-to-br from-brand-purple/20 to-pink-500/20 border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-white font-medium">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Pro Plan</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">Unlock 4K exports and unlimited Veo generations.</p>
                <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-md hover:bg-slate-200">Upgrade Now</button>
             </div>
        </div>
      </aside>
    </>
  );
};