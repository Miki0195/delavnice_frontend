import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import apiClient from '../api/client';
import Button from '../components/ui/Button';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Manjkajoč potrditveni token. Preverite povezavo v e-pošti.');
        return;
      }

      try {
        const response = await apiClient.get(`/auth/verify-email/?token=${token}`);
        setStatus('success');
        setMessage(response.data.detail || 'Email uspešno potrjen!');
        setEmail(response.data.email || '');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error: any) {
        console.error('Verification error:', error);
        console.log('Error response:', error.response?.data);
        setStatus('error');
        
        // Show the actual error from backend
        const errorDetail = error.response?.data?.detail || error.response?.data?.error;
        const errorMessage = errorDetail || 'Napaka pri potrjevanju emaila. Povezava je morda potekla.';
        
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Potrjevanje emaila...
            </h2>
            <p className="text-gray-600">
              Prosimo počakajte, medtem ko potrjujemo vaš email naslov.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email uspešno potrjen!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            {email && (
              <p className="text-sm text-gray-500 mb-6">
                Email: <span className="font-medium">{email}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Sedaj se lahko prijavite s svojim računom.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              fullWidth
            >
              Pojdi na prijavo
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Napaka pri potrjevanju
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                fullWidth
              >
                Nazaj na domov
              </Button>
              <p className="text-sm text-gray-500">
                Če imate težave, kontaktirajte podporo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

