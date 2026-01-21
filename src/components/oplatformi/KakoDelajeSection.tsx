import { SearchCheck, Presentation, CreditCard, CalendarCheck2, PlusSquare, CheckCircle, MessagesSquare, Calendar, Users, ChevronRight, School, Briefcase, FileText, MessageSquare } from 'lucide-react';
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

  const zaPonudnikeSteps = [
    { icon: PlusSquare, title: 'Vnos delavnic' },
    { icon: CheckCircle, title: 'Potrditev rezervacij' },
    { icon: MessagesSquare, title: 'Logistično usklajevanje s šolo' },
    { icon: Users, title: 'Izvedba' },
  ];

  const zaSoleSteps = [
    { icon: SearchCheck, title: 'Iskanje in izbira delavnic' },
    { icon: CalendarCheck2, title: 'Rezervacija termina' },
    { icon: MessagesSquare, title: 'Logistično usklajevanje s ponudnikom' },
    { icon: Presentation, title: 'Izvedba' },
    { icon: CreditCard, title: 'Plačilo' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-primary text-center mb-16">
          Kako deluje?
        </h2>

        { false && (
          <>
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
          </>
        )}

        {/* Side by Side Sections with Illustrations */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ZA ŠOLE Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
              {/* Image at top */}
              {/* <div className="w-full h-48 overflow-hidden">
                {zaSoleImage ? (
                  <img
                    src={zaSoleImage}
                    alt="Učilnica z učenci"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <School className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div> */}

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <School className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">ZA ŠOLE</h3>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {zaSoleSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-base font-semibold text-gray-800">
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/register-sola')}
                  className="w-full mt-auto"
                >
                  Registracija za šole
                </Button>
              </div>
            </div>

            {/* ZA PONUDNIKE Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
              {/* Image at top */}
              {/* <div className="w-full h-48 overflow-hidden">
                {zaPonudnikeImage ? (
                  <img
                    src={zaPonudnikeImage}
                    alt="Ljudje za mizo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div> */}

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">ZA PONUDNIKE</h3>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {zaPonudnikeSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-base font-semibold text-gray-800">
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/register-izvajalec')}
                  className="w-full mt-auto"
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

