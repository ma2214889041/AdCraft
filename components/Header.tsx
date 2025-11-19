import React, { useState } from 'react';
import { Menu, Sparkles, ArrowRight, LogOut, User as UserIcon } from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  onMenuClick: () => void;
  isAppMode?: boolean;
  onLogoClick?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isAppMode = false, onLogoClick, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className={`
      h-24 flex items-center px-4 lg:px-8 w-full
      ${isAppMode 
        ? 'sticky top-0 z-50 bg-brand-dark border-b border-white/10' 
        : 'bg-transparent'}
    `}>
      {/* Left: Logo */}
      <div className="flex-shrink-0 flex items-center">
          {isAppMode && (
            <button onClick={onMenuClick} className="lg:hidden p-2 mr-2 text-white hover:text-brand-purple">
              <Menu className="w-6 h-6" />
            </button>
          )}
          
          <button onClick={onLogoClick} className="flex items-center gap-2 focus:outline-none">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-xl bg-white text-brand-purple">
                <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              AdCraft
            </span>
          </button>
      </div>

      {/* Center: Pill Navigation (Only on Landing Page) */}
      {!isAppMode && (
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="flex items-center gap-1 px-2 py-1.5 bg-[#1e1b4b]/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
            {['Products', 'Use Cases', 'Resources', 'Pricing', 'Enterprise'].map((item) => (
                <a key={item} href="#" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-1">
                {item}
                {item === 'Pricing' || item === 'Enterprise' ? null : <span className="text-[10px] opacity-50 ml-1">▼</span>}
                </a>
            ))}
            <div className="flex items-center gap-2 px-3 py-1.5 ml-2 rounded-full hover:bg-white/5 cursor-pointer">
                <span className="bg-brand-purple text-[10px] font-bold px-1.5 py-0.5 rounded text-white">NEW</span>
                <span className="text-xs font-medium text-white">Explore</span>
            </div>
            </nav>
        </div>
      )}

      {/* Right: Actions */}
      <div className="ml-auto flex items-center gap-6">
         {!isAppMode ? (
             <>
                <a href="#" className="text-sm font-bold text-white tracking-wide hover:text-white/80 hidden xl:block">BOOK A DEMO</a>
                <div className="flex items-center overflow-hidden rounded-lg border border-white/20 shadow-lg group cursor-pointer">
                    <button className="bg-brand-purple hover:bg-indigo-500 w-12 h-12 flex items-center justify-center transition-colors">
                         <img src="https://cdn-icons-png.flaticon.com/512/271/271228.png" className="w-5 h-5 brightness-0 invert rotate-180" alt="arrow" style={{ filter: 'invert(1)' }} /> {/* Placeholder for the specific arrow icon */}
                         <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                    <div className="bg-black px-6 h-12 flex items-center">
                        <span className="text-sm font-bold text-white tracking-widest group-hover:text-gray-200">CREATE</span>
                    </div>
                </div>
             </>
         ) : (
             <div className="relative">
               {user ? (
                 <>
                   <button
                     onClick={() => setShowUserMenu(!showUserMenu)}
                     className="flex items-center gap-3 hover:bg-slate-800/50 rounded-lg p-2 transition-colors"
                   >
                     {user.photoURL ? (
                       <img
                         src={user.photoURL}
                         alt={getUserDisplayName()}
                         className="w-8 h-8 rounded-full border border-slate-600"
                       />
                     ) : (
                       <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white text-sm font-semibold border border-purple-500">
                         {getUserInitials()}
                       </div>
                     )}
                     <span className="text-sm font-medium text-white hidden md:block">
                       {getUserDisplayName()}
                     </span>
                   </button>

                   {/* User Menu Dropdown */}
                   {showUserMenu && (
                     <>
                       {/* Backdrop to close menu */}
                       <div
                         className="fixed inset-0 z-10"
                         onClick={() => setShowUserMenu(false)}
                       />

                       <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-20 overflow-hidden">
                         {/* User Info */}
                         <div className="p-4 border-b border-slate-700">
                           <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                           <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                         </div>

                         {/* Menu Items */}
                         <div className="py-2">
                           <button
                             onClick={() => {
                               setShowUserMenu(false);
                               onLogout?.();
                             }}
                             className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                           >
                             <LogOut className="w-4 h-4" />
                             Sign Out
                           </button>
                         </div>
                       </div>
                     </>
                   )}
                 </>
               ) : (
                 <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                   <UserIcon className="w-4 h-4 text-slate-400" />
                 </div>
               )}
             </div>
         )}
      </div>
    </header>
  );
};