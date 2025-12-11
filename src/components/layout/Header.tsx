import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  LogIn,
  User,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  Briefcase,
  Star,
  Heart,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const cartItemsCount = 0; // TODO: Replace with actual cart count from state
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Nadzorna plošča', path: '/dashboard' },
    { icon: Calendar, label: 'Moje rezervacije', path: '/dashboard/rezervacije' },
    { icon: Briefcase, label: 'Moje delavnice', path: '/dashboard/delavnice' },
    { icon: Star, label: 'Ocene', path: '/dashboard/ocene' },
    { icon: Heart, label: 'Zaznamki', path: '/dashboard/zaznamki' },
    { icon: MessageSquare, label: 'Sporočila', path: '/dashboard/sporocila', badge: 1 },
    { icon: Calendar, label: 'Rezervacije', path: '/dashboard/vse-rezervacije', badge: 1 },
    { icon: User, label: 'Moj profil', path: '/dashboard/profil' },
  ];

  return (
    <>
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-primary">delavnice</span>
            <span className="text-2xl font-bold text-gray-900">.net</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10 px-6 py-2 rounded-full'
                    : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Domov
            </NavLink>
            <NavLink
              to="/o-platformi"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              O platformi
            </NavLink>
            <NavLink
              to="/preventivna-znanost"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Preventivna znanost
            </NavLink>
            <NavLink
              to="/kontakt"
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Kontakt
            </NavLink>
          </nav>

          {/* Right side - Cart & Login */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button className="relative p-2 text-gray-700 hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Login/User Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    {user.school_profile?.profile_picture || user.provider_profile?.profile_picture ? (
                      <img
                        src={user.school_profile?.profile_picture || user.provider_profile?.profile_picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900 text-sm hidden md:block">
                    Moj račun
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            navigate(item.path);
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Odjava</span>
                    </button>
                  </div>
                )}</div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-2 border-2 border-gray-300 rounded-full text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Prijava</span>
              </button>
            )}

            {/* Add Workshop Button - Only for Providers */}
            {isAuthenticated && user?.role === 'PROVIDER' && (
              <button
                onClick={() => navigate('/dashboard/dodaj-delavnico')}
                className="hidden md:flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
              >
                <span className="font-medium">Dodaj delavnico</span>
                <span className="text-xl">+</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />
    </header>
    </>
  );
};

export default Header;

