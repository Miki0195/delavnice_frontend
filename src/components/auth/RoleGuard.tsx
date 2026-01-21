import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('SCHOOL' | 'PROVIDER' | 'ADMIN')[];
  redirectTo?: string;
}

/**
 * RoleGuard component - protects routes based on user role
 * 
 * Usage:
 * <RoleGuard allowedRoles={['PROVIDER']}>
 *   <ProviderOnlyComponent />
 * </RoleGuard>
 */
const RoleGuard = ({ children, allowedRoles, redirectTo }: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user role is not in allowed roles, redirect
  if (user && !allowedRoles.includes(user.role)) {
    // Determine redirect based on user role if not specified
    const defaultRedirect = user.role === 'SCHOOL' 
      ? '/dashboard/rezervacije' 
      : user.role === 'PROVIDER'
      ? '/dashboard'
      : '/';
    
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
