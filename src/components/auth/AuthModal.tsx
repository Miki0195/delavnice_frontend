import { useState } from 'react';
import { X, School, Briefcase } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialView = 'login' }: AuthModalProps) => {
  const [currentView, setCurrentView] = useState<
    'login' | 'register' | 'register-school' | 'register-provider'
  >(initialView);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
    setCurrentView('login'); // Reset to login after successful registration
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Login View */}
          {currentView === 'login' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Prijava</h2>
              <p className="text-gray-600 mb-6">Dobrodošli nazaj!</p>

              <LoginForm onSuccess={handleSuccess} />

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Nimate računa?{' '}
                  <button
                    onClick={() => setCurrentView('register')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Registrirajte se
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Register - Role Selection */}
          {currentView === 'register' && (
            <div>
              <button
                onClick={() => setCurrentView('login')}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
              >
                ← Nazaj na prijavo
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Registracija</h2>
              <p className="text-gray-600 mb-8">
                Izberite vrsto računa, ki ga želite ustvariti:
              </p>

              <div className="space-y-4">
                {/* Register as School */}
                <button
                  onClick={() => setCurrentView('register-school')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <School className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Registracija za šole
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Za izobraževalne ustanove, ki želijo dostopati do preventivnih
                        programov.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Register as Provider */}
                <button
                  onClick={() => setCurrentView('register-provider')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Registracija za ponudnike
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Za organizacije, ki izvajajo preventivne programe za otroke in
                        mladostnike.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Register School Form */}
          {currentView === 'register-school' && (
            <div>
              <button
                onClick={() => setCurrentView('register')}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
              >
                ← Nazaj
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Registracija za šole
              </h2>
              <p className="text-gray-600 mb-6">Ustvarite račun za svojo šolo</p>

              <RegisterForm type="school" onSuccess={handleSuccess} />
            </div>
          )}

          {/* Register Provider Form */}
          {currentView === 'register-provider' && (
            <div>
              <button
                onClick={() => setCurrentView('register')}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
              >
                ← Nazaj
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Registracija za ponudnike
              </h2>
              <p className="text-gray-600 mb-6">Ustvarite račun za svojo organizacijo</p>

              <RegisterForm type="provider" onSuccess={handleSuccess} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

