import React, { useState } from 'react';
import { Menu, Sparkles, ArrowRight, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  onMenuClick: () => void;
  isAppMode?: boolean;
  onLogoClick?: () => void;
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isAppMode = false, onLogoClick, onLoginClick }) => {
  const { user, signOut } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
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
                     className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                   >
                     {user.photoURL ? (
                       <img
                         src={user.photoURL}
                         alt={user.displayName || 'User'}
                         className="w-8 h-8 rounded-full border border-slate-600"
                       />
                     ) : (
                       <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm">
                         {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                       </div>
                     )}
                     <span className="hidden md:block text-white text-sm font-medium max-w-[120px] truncate">
                       {user.displayName || user.email}
                     </span>
                   </button>

                   {/* User dropdown menu */}
                   {showUserMenu && (
                     <>
                       <div
                         className="fixed inset-0 z-40"
                         onClick={() => setShowUserMenu(false)}
                       />
                       <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
                         <div className="p-4 border-b border-white/10">
                           <p className="text-white font-medium truncate">{user.displayName || '用户'}</p>
                           <p className="text-slate-400 text-sm truncate">{user.email}</p>
                         </div>
                         <button
                           onClick={handleSignOut}
                           className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                         >
                           <LogOut className="w-4 h-4" />
                           <span className="text-sm">退出登录</span>
                         </button>
                       </div>
                     </>
                   )}
                 </>
               ) : (
                 <button
                   onClick={onLoginClick}
                   className="flex items-center gap-2 px-4 py-2 bg-brand-purple hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm"
                 >
                   <User className="w-4 h-4" />
                   <span>登录</span>
                 </button>
               )}
             </div>
         )}
      </div>
    </header>
  );
};