import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Star,
  Heart,
  MessageSquare,
  ClipboardList,
  User,
  LogOut,
  Bell,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getConversations } from '../../api/messages';
import { getMyWorkshopsCounts } from '../../api/workshops';
import { getReservationCounts } from '../../api/reservations';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDelavniceOpen, setIsDelavniceOpen] = useState(false);
  const [isRezervacijeOpen, setIsRezervacijeOpen] = useState(false);

  // Fetch workshop counts for provider
  const { data: workshopCounts } = useQuery({
    queryKey: ['workshop-counts'],
    queryFn: getMyWorkshopsCounts,
    enabled: user?.role === 'PROVIDER',
  });

  // Fetch reservation counts for provider
  const { data: reservationCounts } = useQuery({
    queryKey: ['reservation-counts'],
    queryFn: getReservationCounts,
    enabled: user?.role === 'PROVIDER',
  });

  // Fetch conversations to check for unread messages
  const { data: conversationsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  // Check if there are any unread messages
  const conversations = Array.isArray(conversationsData) ? conversationsData : [];
  const hasUnreadMessages = conversations.some(conv => conv.unread_count > 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'Nadzorna plošča',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Moje rezervacije',
      path: '/dashboard/rezervacije',
      icon: Calendar,
    },
    {
      title: 'Sporočila',
      path: '/dashboard/sporocila',
      icon: MessageSquare,
      hasNotification: hasUnreadMessages,
    },
  ];

  // Additional menu items based on role
  const bottomMenuItems = [
    // Zaznamki for non-providers (providers have it in Delavnice section)
    ...(user?.role !== 'PROVIDER'
      ? [
          {
            title: 'Zaznamki',
            path: '/dashboard/zaznamki',
            icon: Heart,
          },
        ]
      : []),
    {
      title: 'Moj profil',
      path: '/dashboard/profil',
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <NavLink to="/" className="flex items-center space-x-1">
            <span className="text-xl font-bold text-primary">delavnice</span>
            <span className="text-xl font-bold text-white">.net</span>
          </NavLink>
        </div>

        {/* Main Menu */}
        <nav className="py-6">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Glavni meni
            </p>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  {item.hasNotification && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </NavLink>
              );
            })}

            {/* Rezervacije dropdown - only for providers */}
            {user?.role === 'PROVIDER' && (
              <div>
                <button
                  onClick={() => setIsRezervacijeOpen(!isRezervacijeOpen)}
                  className={`flex items-center justify-between w-full px-6 py-3 text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/dashboard/vse-rezervacije')
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-5 h-5" />
                    <span>Rezervacije</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isRezervacijeOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isRezervacijeOpen && (
                  <div className="bg-gray-800 py-1">
                    <NavLink
                      to="/dashboard/vse-rezervacije?status=PENDING"
                      className="flex items-center justify-between px-12 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <span>V obravnavi</span>
                      <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {reservationCounts?.pending || 0}
                      </span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/vse-rezervacije?status=APPROVED"
                      className="flex items-center justify-between px-12 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <span>Odobreno</span>
                      <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {reservationCounts?.approved || 0}
                      </span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/vse-rezervacije?status=CANCELLED"
                      className="flex items-center justify-between px-12 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <span>Preklicano</span>
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {reservationCounts?.cancelled || 0}
                      </span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delavnice Section */}
          {user?.role === 'PROVIDER' && (
            <>
              <div className="px-4 mb-4 mt-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Delavnice
                </p>
              </div>

              <div className="space-y-1">
                <NavLink
                  to="/dashboard/dodaj-delavnico"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <Plus className="w-5 h-5" />
                  <span>Dodaj delavnico</span>
                </NavLink>
                
                {/* Moje delavnice dropdown */}
                <div>
                  <button
                    onClick={() => setIsDelavniceOpen(!isDelavniceOpen)}
                    className={`flex items-center justify-between w-full px-6 py-3 text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/dashboard/delavnice')
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5" />
                      <span>Moje delavnice</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDelavniceOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDelavniceOpen && (
                    <div className="bg-gray-800 py-1">
                      <NavLink
                        to="/dashboard/delavnice?status=active"
                        className="flex items-center justify-between px-12 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <span>Aktivno</span>
                        <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {workshopCounts?.active || 0}
                        </span>
                      </NavLink>
                      <NavLink
                        to="/dashboard/delavnice?status=in_review"
                        className="flex items-center justify-between px-12 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <span>V obravnavi</span>
                        <span className="bg-gray-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {workshopCounts?.in_review || 0}
                        </span>
                      </NavLink>
                      <NavLink
                        to="/dashboard/delavnice?status=expired"
                        className="flex items-center justify-between px-12 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <span>Poteklo</span>
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {workshopCounts?.expired || 0}
                        </span>
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* Ocene */}
                <NavLink
                  to="/dashboard/ocene"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <Star className="w-5 h-5" />
                  <span>Ocene</span>
                </NavLink>

                {/* Zaznamki */}
                <NavLink
                  to="/dashboard/zaznamki"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <Heart className="w-5 h-5" />
                  <span>Zaznamki</span>
                </NavLink>
              </div>
            </>
          )}

          {/* Account Section */}
          <div className="px-4 mb-4 mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Račun
            </p>
          </div>

          <div className="space-y-1">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Odjava</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Hello {user?.username || user?.email} !
            </h1>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

