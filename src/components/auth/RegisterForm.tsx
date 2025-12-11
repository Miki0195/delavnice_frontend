import { useState, FormEvent } from 'react';
import { registerSchool, registerProvider } from '../../api/auth';
import Button from '../ui/Button';

interface RegisterFormProps {
  type: 'school' | 'provider';
  onSuccess: () => void;
}

const RegisterForm = ({ type, onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    organization_name: '',
    email: '',
    password: '',
    password_confirm: '',
    accepted_terms: false,
    accepted_privacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const registerFn = type === 'school' ? registerSchool : registerProvider;
      const response = await registerFn(formData);
      
      setSuccessMessage(response.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.response?.data) {
        const apiErrors = err.response.data;
        const newErrors: Record<string, string> = {};
        
        Object.keys(apiErrors).forEach((key) => {
          const errorValue = apiErrors[key];
          if (Array.isArray(errorValue)) {
            newErrors[key] = errorValue[0];
          } else if (typeof errorValue === 'string') {
            newErrors[key] = errorValue;
          }
        });
        
        setErrors(newErrors);
      } else {
        setErrors({ general: 'Napaka pri registraciji. Poskusite ponovno.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <p className="font-medium">{successMessage}</p>
          <p className="text-sm mt-2">
            <strong>Pomembno:</strong> Preden se lahko prijavite, morate potrditi svoj email naslov. 
            Preverite svojo e-pošto in kliknite na potrditveno povezavo.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-1">
          {type === 'school' ? 'Ime šole / institucije' : 'Ime organizacije'}
        </label>
        <input
          type="text"
          id="organization_name"
          name="organization_name"
          value={formData.organization_name}
          onChange={handleChange}
          required
          className={`input-field ${errors.organization_name ? 'border-red-500' : ''}`}
          placeholder={type === 'school' ? 'OŠExample' : 'Moja Organizacija d.o.o.'}
        />
        {errors.organization_name && (
          <p className="text-red-600 text-sm mt-1">{errors.organization_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-pošta
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          placeholder="ime@primer.si"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Geslo
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className={`input-field ${errors.password ? 'border-red-500' : ''}`}
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Geslo mora biti najmanj 8 znakov dolgo in vsebovati številke in črke.
        </p>
      </div>

      <div>
        <label
          htmlFor="password_confirm"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ponovite geslo
        </label>
        <input
          type="password"
          id="password_confirm"
          name="password_confirm"
          value={formData.password_confirm}
          onChange={handleChange}
          required
          className={`input-field ${errors.password_confirm ? 'border-red-500' : ''}`}
          placeholder="••••••••"
        />
        {errors.password_confirm && (
          <p className="text-red-600 text-sm mt-1">{errors.password_confirm}</p>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="accepted_terms"
            checked={formData.accepted_terms}
            onChange={handleChange}
            required
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Strinjam se s{' '}
            <a href="/terms" className="text-primary hover:underline">
              pogoji uporabe
            </a>
          </span>
        </label>
        {errors.accepted_terms && (
          <p className="text-red-600 text-sm">{errors.accepted_terms}</p>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="accepted_privacy"
            checked={formData.accepted_privacy}
            onChange={handleChange}
            required
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Strinjam se s{' '}
            <a href="/privacy" className="text-primary hover:underline">
              politiko zasebnosti
            </a>
          </span>
        </label>
        {errors.accepted_privacy && (
          <p className="text-red-600 text-sm">{errors.accepted_privacy}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isLoading}
        className="mt-6"
      >
        {isLoading ? 'Registracija...' : 'Registracija'}
      </Button>
    </form>
  );
};

export default RegisterForm;

