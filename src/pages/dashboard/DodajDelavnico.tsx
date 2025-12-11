import { useNavigate } from 'react-router-dom';
import { MapPin, ShoppingBag } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const DodajDelavnico = () => {
  const navigate = useNavigate();

  const workshopTypes = [
    {
      type: 'storitev',
      title: 'Storitev',
      description:
        'Ponudba, ki ni vezana na točno določen datum ali kraj in je stalno objavljena.',
      icon: MapPin,
      path: '/dashboard/dodaj-delavnico/storitev',
    },
    {
      type: 'dogodek',
      title: 'Dogodek',
      description:
        'Storitev, ki poteka na vnaprej določen datum in lokaciji ter je odprta za širšo javnost.',
      icon: ShoppingBag,
      path: '/dashboard/dodaj-delavnico/dogodek',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary transition-colors"
            >
              Domov
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Nadzorna plošča</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Dodaj delavnice</h1>
        </div>

        {/* Workshop Type Selection */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Izberi vrsto delavnice
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshopTypes.map((workshop) => {
              const Icon = workshop.icon;
              return (
                <button
                  key={workshop.type}
                  onClick={() => navigate(workshop.path)}
                  className="group relative bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-primary hover:shadow-lg transition-all duration-200 text-center"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {workshop.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {workshop.description}
                  </p>

                  {/* Hover effect indicator */}
                  <div className="absolute inset-0 rounded-lg border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DodajDelavnico;
