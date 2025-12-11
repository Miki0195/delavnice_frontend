import { Search, CheckCircle, Calendar, Users, ChevronRight, School, Briefcase, FileText, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

import zaSoleImg from '../../assets/images/za-sole-classroom.png';
import zaPonudnikeImg from '../../assets/images/za-ponudnike-table.png';

const KakoDelajeSection = () => {
  const navigate = useNavigate();
  
  const zaSoleImage = zaSoleImg; 
  const zaPonudnikeImage = zaPonudnikeImg; 

  const zaSoleItems = [
    'Registracija',
    'Uporaba nadzorne plošče',
    'Iskanje programov',
    'Izbira programa',
    'Rezervacija termina',
    'Plačilo',
    'Izvedba',
    'Pomoč',
  ];

  const zaPonudnikeItems = [
    'Pogoji',
    'Registracija',
    'Uporaba nadzorne plošče',
    'Vnos delavnic',
    'Rezervacije delavnic in potrditev',
    'Plačilo',
    'Izvedba',
    'Pomoč',
  ];

  const zaSoleSteps = [
    { icon: Search, title: 'Iskanje programov' },
    { icon: CheckCircle, title: 'Izbira programa' },
    { icon: Calendar, title: 'Rezervacija termina' },
    { icon: Users, title: 'Izvedba' },
  ];

  const zaPonudnikeSteps = [
    { icon: FileText, title: 'Registracija' },
    { icon: Briefcase, title: 'Vnos delavnic' },
    { icon: Calendar, title: 'Rezervacije delavnic in potrditev' },
    { icon: MessageSquare, title: 'Plačilo' },
    { icon: Users, title: 'Izvedba' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-primary text-center mb-16">
          Kako deluje?
        </h2>

        {/* Two Columns with Dropdown Lists */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* ZA ŠOLE Column */}
            <div>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <School className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">ZA ŠOLE:</h3>
              </div>

              <div className="space-y-3">
                {zaSoleItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-primary hover:text-primary-dark cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/register-sola')}
                  className="w-full"
                >
                  Registracija za šole
                </Button>
              </div>
            </div>

            {/* ZA PONUDNIKE Column */}
            <div>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">ZA PONUDNIKE:</h3>
              </div>

              <div className="space-y-3">
                {zaPonudnikeItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-primary hover:text-primary-dark cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/register-izvajalec')}
                  className="w-full"
                >
                  Registracija za ponudnike
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ZA ŠOLE Section with Illustration */}
        <div className="max-w-7xl mx-auto mb-20 bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Steps */}
            <div>
              <h3 className="text-3xl font-bold text-primary mb-8">ZA ŠOLE:</h3>

              <div className="space-y-6">
                {zaSoleSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h4>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/register-sola')}
                >
                  Registracija za šole
                </Button>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="flex justify-center">
              {zaSoleImage ? (
                <img
                  src={zaSoleImage}
                  alt="Učilnica z učenci"
                  className="w-full max-w-md rounded-3xl shadow-lg object-cover"
                />
              ) : (
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center">
                  <School className="w-32 h-32 text-primary" />
                  <span className="absolute text-gray-500 text-sm mt-40">
                    [Dodaj sliko za šole]
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ZA PONUDNIKE Section with Illustration */}
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Illustration */}
            <div className="flex justify-center order-2 lg:order-1">
              {zaPonudnikeImage ? (
                <img
                  src={zaPonudnikeImage}
                  alt="Ljudje za mizo"
                  className="w-full max-w-md rounded-3xl shadow-lg object-cover"
                />
              ) : (
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center">
                  <Briefcase className="w-32 h-32 text-primary" />
                  <span className="absolute text-gray-500 text-sm mt-40">
                    [Dodaj sliko za ponudnike]
                  </span>
                </div>
              )}
            </div>

            {/* Right: Steps */}
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-primary mb-8">
                ZA PONUDNIKE DELAVNIC:
              </h3>

              <div className="space-y-6">
                {zaPonudnikeSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h4>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/register-izvajalec')}
                >
                  Registracija za ponudnike
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KakoDelajeSection;

