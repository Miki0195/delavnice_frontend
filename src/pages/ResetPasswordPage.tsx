import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, CheckCircle, XCircle, Lock } from 'lucide-react';
import { confirmPasswordReset } from '../api/passwordReset';
import Button from '../components/ui/Button';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetMutation = useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: (data) => {
      // Success - redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const errorData = error.response.data;
        const newErrors: Record<string, string> = {};
        
        Object.keys(errorData).forEach((key) => {
          const errorValue = errorData[key];
          if (Array.isArray(errorValue)) {
            newErrors[key] = errorValue[0];
          } else if (typeof errorValue === 'string') {
            newErrors[key] = errorValue;
          }
        });
        
        setErrors(newErrors);
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setErrors({ general: 'Manjka žeton za ponastavitev gesla.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirm_password: 'Gesli se ne ujemata.' });
      return;
    }

    resetMutation.mutate({
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  };

  // Check if token is provided
  useEffect(() => {
    if (!token) {
      setErrors({ general: 'Neveljavna povezava za ponastavitev gesla.' });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ponastavitev gesla
            </h1>
            <p className="text-gray-600">
              Vnesite novo geslo za svoj račun
            </p>
          </div>

          {/* Success State */}
          {resetMutation.isSuccess && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Geslo uspešno ponastavljeno!</h3>
              <p className="text-gray-600">
                Vaše geslo je bilo uspešno spremenjeno. Sedaj se lahko prijavite z novim geslom.
              </p>
              <p className="text-sm text-gray-500">
                Preusmeritev na domačo stran čez 3 sekunde...
              </p>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                fullWidth
              >
                Pojdi na domačo stran
              </Button>
            </div>
          )}

          {/* Form */}
          {!resetMutation.isSuccess && (
            <>
              {/* General Errors */}
              {(errors.general || errors.error || errors.detail) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{errors.general || errors.error || 'Napaka'}</p>
                    {errors.detail && <p className="text-sm mt-1">{errors.detail}</p>}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Novo geslo
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={resetMutation.isPending}
                      className={`input-field pr-10 ${errors.new_password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.new_password}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Geslo mora biti najmanj 8 znakov dolgo in vsebovati številke in črke.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Potrdite novo geslo
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={resetMutation.isPending}
                      className={`input-field pr-10 ${errors.confirm_password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={resetMutation.isPending || !token}
                >
                  {resetMutation.isPending ? 'Ponastavitev...' : 'Ponastavi geslo'}
                </Button>
              </form>

              {/* <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Nazaj na domačo stran
                </button>
              </div> */}
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Opomba:</strong> Novo geslo ne sme biti enako staremu geslu. Povezava za ponastavitev je veljavna 48 ur in jo lahko uporabite samo enkrat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
