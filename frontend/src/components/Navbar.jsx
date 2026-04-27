import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bot, Activity, FileText, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Track Complaint', path: '/track', icon: <Activity size={16} /> },
    { name: 'AI Assistant', path: '/assistant', icon: <Bot size={16} /> },
  ];

  if (user) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    navLinks.push({ name: 'Report Issue', path: '/report', icon: <FileText size={16} /> });
    if (user.role === 'admin') {
      navLinks.push({ name: 'Admin', path: '/admin', icon: <Shield size={16} /> });
    }
  }

  return (
    <nav className="fixed w-full z-50 glass-panel border-x-0 border-t-0 rounded-none bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                <Shield className="text-darker" size={20} />
              </div>
              <span className="text-xl font-bold tracking-wider text-white neon-text">
                JANA<span className="text-neon">SEVA</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                    ${isActive(link.path) 
                      ? 'text-neon bg-neon/10 border-b-2 border-neon' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <UserIcon size={16} className="text-neon" />
                  <span>{user.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-gray-400 hover:text-neon transition-colors flex items-center gap-1 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="neon-button text-sm">
                Login / Signup
              </Link>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel border-x-0 rounded-none absolute w-full left-0 top-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2
                  ${isActive(link.path)
                    ? 'text-neon bg-neon/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 mt-4 text-center neon-button-solid"
              >
                Login / Signup
              </Link>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-2 mt-4 text-red-400 hover:bg-white/5 rounded-md flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
