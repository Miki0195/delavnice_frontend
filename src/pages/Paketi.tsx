import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, TrendingUp, Rocket, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

interface PackageFeature {
  text: string;
  included: boolean;
}

interface Package {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
  bgGradient: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  serviceFeePercent: number;
  serviceFeeFlat: number;
  savings?: string;
  isPopular?: boolean;
  isCustom?: boolean;
  features: PackageFeature[];
}

const Paketi = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Redirect if not a provider
  if (user?.role !== 'PROVIDER') {
    navigate('/');
    return null;
  }

  const packages: Package[] = [
    {
      id: 'FREE',
      name: 'Free',
      tagline: 'Za manjše organizacije, ki želijo testirati platformo',
      icon: Sparkles,
      color: 'green',
      bgGradient: 'from-green-50 to-emerald-50',
      monthlyPrice: 0,
      yearlyPrice: 0,
      serviceFeePercent: 15,
      serviceFeeFlat: 15,
      features: [
        { text: 'Osnovni profil', included: true },
        { text: 'Maksimalno 2 dodatni storitvi na delavnico', included: true },
        { text: 'Podpora po e-pošti', included: false },
        { text: 'Promocija v izbranih vsebinah za šole', included: false },
        { text: 'Analitika in izvoz podatkov', included: false },
        { text: 'Prednostni prikaz v iskanju', included: false },
      ],
    },
    {
      id: 'LITE',
      name: 'Lite',
      tagline: 'Za družba in NVO, ki izvajajo redne delavnice in želijo večjo vidnost',
      icon: TrendingUp,
      color: 'blue',
      bgGradient: 'from-blue-50 to-cyan-50',
      monthlyPrice: 47,
      yearlyPrice: 451,
      serviceFeePercent: 12,
      serviceFeeFlat: 12,
      savings: 'Prihrranite 20%',
      features: [
        { text: 'Maksimalno 3 dodatne storitve na delavnico', included: true },
        { text: 'Prednostni prikaz v iskanju', included: true },
        { text: 'Promocija v izbranih vsebinah za šole (omemba v katalogu)', included: true },
        { text: 'Prvih 250 € provizije je subvencioniranih (ob enoletni vključitvi)', included: true },
        { text: 'Analitika in izvoz podatkov', included: false },
        { text: 'Osebna podpora (onboarding/account manager)', included: false },
      ],
    },
    {
      id: 'PRO',
      name: 'Pro',
      tagline: 'Za organizacije z bogato ponudbo delavnic, ki želijo najboljšo izkušnjo in podporo',
      icon: Rocket,
      color: 'red',
      bgGradient: 'from-red-50 to-orange-50',
      monthlyPrice: 97,
      yearlyPrice: 931,
      serviceFeePercent: 10,
      serviceFeeFlat: 10,
      isPopular: true,
      features: [
        { text: 'Maksimalno 5 dodatnih storitev na delavnico', included: true },
        { text: 'Analitika in izvoz podatkov za poročila financerjem', included: true },
        { text: 'Prednostni prikaz v iskanju', included: true },
        { text: 'Promocija v izbranih vsebinah za šole (omemba v katalogu)', included: true },
        { text: 'Osebna podpora (onboarding/account manager)', included: true },
        { text: 'Prvih 600 € provizije je subvencioniranih (ob enoletni vključitvi)', included: true },
      ],
    },
    {
      id: 'STRATESKI',
      name: 'Strateški',
      tagline: 'Za podporne organizacije z bogato ponudbo, ki želijo podpirati postavitev platforme',
      icon: Crown,
      color: 'yellow',
      bgGradient: 'from-yellow-50 to-amber-50',
      monthlyPrice: null,
      yearlyPrice: null,
      serviceFeePercent: 10,
      serviceFeeFlat: 10,
      isCustom: true,
      features: [
        { text: 'Neomejeno storitev na delavnico', included: true },
        { text: 'Analitika in izvoz podatkov za poročila financerjem', included: true },
        { text: 'Prednostni prikaz v iskanju', included: true },
        { text: 'Promocija v izbranih vsebinah za šole (oglas v katalogu)', included: true },
        { text: 'Osebna podpora (onboarding/account manager)', included: true },
        { text: 'Prednostni razvoj funkcij in prilagajanje delovanja strani', included: true },
        { text: 'Po dogovoru - subvencija provizije', included: true },
      ],
    },
  ];

  const getColorClasses = (color: string, variant: 'button' | 'badge' | 'border') => {
    const colorMap = {
      green: {
        button: 'bg-green-600 hover:bg-green-700 text-white',
        badge: 'bg-green-100 text-green-800',
        border: 'border-green-500',
      },
      blue: {
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        badge: 'bg-blue-100 text-blue-800',
        border: 'border-blue-500',
      },
      red: {
        button: 'bg-red-600 hover:bg-red-700 text-white',
        badge: 'bg-red-100 text-red-800',
        border: 'border-red-500',
      },
      yellow: {
        button: 'bg-amber-600 hover:bg-amber-700 text-white',
        badge: 'bg-amber-100 text-amber-800',
        border: 'border-amber-500',
      },
    };
    return colorMap[color as keyof typeof colorMap]?.[variant] || '';
  };

  const handleSelectPackage = (packageId: string) => {
    // TODO: Implement payment integration
    console.log('Selected package:', packageId, 'Billing period:', billingPeriod);
    alert(`Izbran paket: ${packageId}\nObračunsko obdobje: ${billingPeriod === 'monthly' ? 'Mesečno' : 'Letno'}\n\nIntegracija plačila bo dodana kasneje.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Izberite paket, ki ustreza vašim potrebam
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Prilagodljivi paketi za organizacije vseh velikosti. Začnite brezplačno in nadgradite, ko ste pripravljeni.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Mesečno
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-3 rounded-full font-medium transition-all relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Letno
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              const price = billingPeriod === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice;
              
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    pkg.isPopular ? `${getColorClasses(pkg.color, 'border')}` : 'border-gray-200'
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Najbolj priljubljen
                      </span>
                    </div>
                  )}

                  <div className={`bg-gradient-to-br ${pkg.bgGradient} p-8 rounded-t-2xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-10 h-10 text-${pkg.color}-600`} />
                      {pkg.savings && billingPeriod === 'yearly' && (
                        <span className="bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                          {pkg.savings}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 min-h-[60px]">{pkg.tagline}</p>
                  </div>

                  <div className="p-8">
                    {/* Price */}
                    <div className="mb-6">
                      {pkg.isCustom ? (
                        <div>
                          <div className="text-3xl font-bold text-gray-900">Po dogovoru</div>
                          <div className="text-sm text-gray-500 mt-1">Kontaktirajte nas za ponudbo</div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold text-gray-900">{price}€</span>
                            <span className="text-gray-500 ml-2">
                              /{billingPeriod === 'monthly' ? 'mesec' : 'leto'}
                            </span>
                          </div>
                          {billingPeriod === 'yearly' && price && price > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              {(price / 12).toFixed(2)}€ na mesec
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Service Fee */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Provizija storitve</div>
                        <div className="text-sm font-semibold text-gray-700">
                          {pkg.serviceFeePercent}% / {pkg.serviceFeeFlat}€ {pkg.id === 'FREE' ? 'brezplačno' : 'brezplačno'}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 ${getColorClasses(
                        pkg.color,
                        'button'
                      )}`}
                    >
                      {pkg.id === 'FREE' ? 'Začni brezplačno' : pkg.isCustom ? 'Kontaktirajte nas' : 'Izberi paket'}
                    </button>

                    {/* Features */}
                    <div className="space-y-3">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`text-sm ${
                              feature.included ? 'text-gray-700' : 'text-gray-400'
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-primary to-cyan-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Potrebujete pomoč pri izbiri?</h2>
            <p className="text-lg mb-6 opacity-90">
              Naša ekipa vam bo z veseljem pomagala najti paket, ki najbolje ustreza vašim potrebam.
            </p>
            <button
              onClick={() => navigate('/kontakt')}
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Kontaktirajte nas
            </button>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Pogosta vprašanja</h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-lg shadow-md">
                <summary className="font-semibold text-lg cursor-pointer">
                  Kako deluje provizija storitve?
                </summary>
                <p className="mt-4 text-gray-600">
                  Provizija storitve se obračuna pri vsaki rezervaciji. Odvisen je od izbranega paketa in se obračuna kot odstotek cene storitve ali fiksna provizija, kar je nižje.
                </p>
              </details>
              <details className="bg-white p-6 rounded-lg shadow-md">
                <summary className="font-semibold text-lg cursor-pointer">
                  Ali lahko kadarkoli spremenim paket?
                </summary>
                <p className="mt-4 text-gray-600">
                  Da, paket lahko kadarkoli nadgradite ali znižate. Spremembe bodo stopile v veljavo ob začetku naslednjega obračunskega obdobja.
                </p>
              </details>
              <details className="bg-white p-6 rounded-lg shadow-md">
                <summary className="font-semibold text-lg cursor-pointer">
                  Kaj vključuje subvencija provizije?
                </summary>
                <p className="mt-4 text-gray-600">
                  Pri paketih Lite, Pro in Strateški je določen znesek provizije subvencioniran, kar pomeni, da prvih X evrov provizije ne plačate. To velja ob enoletni vključitvi.
                </p>
              </details>
              <details className="bg-white p-6 rounded-lg shadow-md">
                <summary className="font-semibold text-lg cursor-pointer">
                  Kaj ponuja Strateški paket?
                </summary>
                <p className="mt-4 text-gray-600">
                  Strateški paket je namenjen večjim organizacijam z obsežno ponudbo. Cena in pogoji so prilagojeni vašim potrebam. Kontaktirajte nas za individualno ponudbo.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Paketi;
