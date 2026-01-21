import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '../../api/passwordReset';
import Button from '../ui/Button';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const resetMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    resetMutation.mutate({ email });
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Preverite svojo e-pošto</h3>
        <p className="text-gray-600">
          Če obstaja račun z naslovom <strong>{email}</strong>, smo vam poslali povezavo za ponastavitev gesla.
        </p>
        <p className="text-sm text-gray-500">
          Povezava bo veljavna 48 ur in jo lahko uporabite samo enkrat.
        </p>
        <Button
          type="button"
          onClick={onBack}
          variant="primary"
          fullWidth
          className="mt-6"
        >
          Nazaj na prijavo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Nazaj na prijavo
      </button>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Pozabljeno geslo?</h3>
        <p className="text-gray-600">
          Vnesite svoj e-poštni naslov in poslali vam bomo povezavo za ponastavitev gesla.
        </p>
      </div>

      {resetMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Prišlo je do napake. Prosimo, poskusite ponovno.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            E-poštni naslov
          </label>
          <input
            type="email"
            id="reset-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="ime@primer.si"
            disabled={resetMutation.isPending}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={resetMutation.isPending}
          className="mt-6"
        >
          {resetMutation.isPending ? 'Pošiljanje...' : 'Pošlji povezavo za ponastavitev'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Povezava bo veljavna 48 ur in jo lahko uporabite samo enkrat.
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
