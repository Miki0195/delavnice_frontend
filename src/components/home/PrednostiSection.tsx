import { CheckCircle, Network, Zap, MessageCircle } from 'lucide-react';

const PrednostiSection = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Kakovostni in preverjeni programi',
      description:
        'Vsi programi, ki jih ponudniki ponujajo prek naše platforme, so bili strokovno preverjeni z vidika kakovosti. Platforma nudi jasno primerjavo med različnimi ponudniki.',
    },
    {
      icon: Network,
      title: 'Širok nabor ponudnikov',
      description:
        'Prek naše platforme lahko dostopate do delavnic, ki pokrivajo širok nabor tematik, pomembnih za otroke in mladostnike.',
    },
    {
      icon: Zap,
      title: 'Prihranek časa in energije',
      description:
        'Uporaba naše platforme vam omogoča lažje in hitrejše brskanje med dostopnimi programi na enem mestu.',
    },
    {
      icon: MessageCircle,
      title: 'Povratne informacije predhodnih odjemalcev',
      description:
        'Prek naše platforme lahko preverite mnenje predhodnih uporabnikov posameznih programov.',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">
          Prednosti
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow text-center"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrednostiSection;

