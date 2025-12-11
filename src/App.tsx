import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Domov from './pages/Domov';
import Delavnice from './pages/Delavnice';
import OPlatformi from './pages/OPlatformi';
import PreventivnaZnanost from './pages/PreventivnaZnanost';
import Kontakt from './pages/Kontakt';
import VerifyEmailPage from './pages/VerifyEmailPage';
import WorkshopDetail from './pages/WorkshopDetail';
import BookingPage from './pages/BookingPage';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import MojeRezervacije from './pages/dashboard/MojeRezervacije';
import MojeDelavnice from './pages/dashboard/MojeDelavnice';
import MojProfil from './pages/dashboard/MojProfil';
import Sporocila from './pages/dashboard/Sporocila';
import Ocene from './pages/dashboard/Ocene';
import Zaznamki from './pages/dashboard/Zaznamki';
import VseRezervacije from './pages/dashboard/VseRezervacije';
import DodajDelavnico from './pages/dashboard/DodajDelavnico';
import DodajStoritev from './pages/dashboard/DodajStoritev';
import DodajDogodek from './pages/dashboard/DodajDogodek';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isVerifyEmail = location.pathname === '/auth/verify-email';
  const showLayout = !isDashboard && !isVerifyEmail;

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Header />}
      <main className={!showLayout ? '' : 'flex-1'}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Domov />} />
          <Route path="/domov" element={<Domov />} />
          <Route path="/delavnice" element={<Delavnice />} />
          <Route path="/o-platformi" element={<OPlatformi />} />
          <Route path="/preventivna-znanost" element={<PreventivnaZnanost />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/workshop/:id" element={<WorkshopDetail />} />
          <Route path="/workshop/:id/booking" element={<BookingPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/rezervacije" element={<MojeRezervacije />} />
          <Route path="/dashboard/delavnice" element={<MojeDelavnice />} />
          <Route path="/dashboard/dodaj-delavnico" element={<DodajDelavnico />} />
          <Route path="/dashboard/dodaj-delavnico/storitev" element={<DodajStoritev />} />
          <Route path="/dashboard/dodaj-delavnico/dogodek" element={<DodajDogodek />} />
          <Route path="/dashboard/uredi-storitev/:id" element={<DodajStoritev />} />
          <Route path="/dashboard/uredi-dogodek/:id" element={<DodajDogodek />} />
          <Route path="/dashboard/ocene" element={<Ocene />} />
          <Route path="/dashboard/zaznamki" element={<Zaznamki />} />
          <Route path="/dashboard/sporocila" element={<Sporocila />} />
          <Route path="/dashboard/vse-rezervacije" element={<VseRezervacije />} />
          <Route path="/dashboard/profil" element={<MojProfil />} />
        </Routes>
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
