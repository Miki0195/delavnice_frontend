import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import RoleGuard from './components/auth/RoleGuard';
import Domov from './pages/Domov';
import Delavnice from './pages/Delavnice';
import OPlatformi from './pages/OPlatformi';
import PreventivnaZnanost from './pages/PreventivnaZnanost';
import Kontakt from './pages/Kontakt';
import Paketi from './pages/Paketi';
import PolitikaZasebnosti from './pages/PolitikaZasebnosti';
import PogojiUporabe from './pages/PogojiUporabe';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WorkshopDetail from './pages/WorkshopDetail';
import BookingPage from './pages/BookingPage';
import ScrollToTop from './helpers/ScrollToTop';

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
  const isResetPassword = location.pathname === '/reset-password';
  const showLayout = !isDashboard && !isVerifyEmail && !isResetPassword;

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Header />}
      <main className={!showLayout ? '' : 'flex-1'}>
        < ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Domov />} />
          <Route path="/domov" element={<Domov />} />
          <Route path="/delavnice" element={<Delavnice />} />
          <Route path="/o-platformi" element={<OPlatformi />} />
          <Route path="/preventivna-znanost" element={<PreventivnaZnanost />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/paketi" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <Paketi />
            </RoleGuard>
          } />
          <Route path="/politika-zasebnosti" element={<PolitikaZasebnosti />} />
          <Route path="/pogoji-uporabe" element={<PogojiUporabe />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/workshop/:id" element={<WorkshopDetail />} />
          <Route path="/workshop/:id/booking" element={<BookingPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          } />

          {/* Dashboard routes - Main dashboard (not accessible by schools) */}
          <Route path="/dashboard" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <Dashboard />
            </RoleGuard>
          } />

          {/* Reservations - Only for schools (their bookings) */}
          <Route path="/dashboard/rezervacije" element={
            <RoleGuard allowedRoles={['SCHOOL', 'ADMIN']}>
              <MojeRezervacije />
            </RoleGuard>
          } />

          {/* Provider-only routes */}
          <Route path="/dashboard/delavnice" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <MojeDelavnice />
            </RoleGuard>
          } />
          <Route path="/dashboard/dodaj-delavnico" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <DodajDelavnico />
            </RoleGuard>
          } />
          <Route path="/dashboard/dodaj-delavnico/storitev" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <DodajStoritev />
            </RoleGuard>
          } />
          <Route path="/dashboard/dodaj-delavnico/dogodek" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <DodajDogodek />
            </RoleGuard>
          } />
          <Route path="/dashboard/uredi-storitev/:id" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <DodajStoritev />
            </RoleGuard>
          } />
          <Route path="/dashboard/uredi-dogodek/:id" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <DodajDogodek />
            </RoleGuard>
          } />
          <Route path="/dashboard/ocene" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <Ocene />
            </RoleGuard>
          } />
          <Route path="/dashboard/vse-rezervacije" element={
            <RoleGuard allowedRoles={['PROVIDER', 'ADMIN']}>
              <VseRezervacije />
            </RoleGuard>
          } />

          {/* Common routes - accessible by all authenticated users */}
          <Route path="/dashboard/zaznamki" element={<Zaznamki />} />
          <Route path="/dashboard/sporocila" element={<Sporocila />} />
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
