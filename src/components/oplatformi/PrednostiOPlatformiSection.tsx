import { CheckCircle, Network, Zap, MessageCircle } from 'lucide-react';

const PrednostiOPlatformiSection = () => {
  const prednosti = [
    {
      icon: CheckCircle,
      title: 'Poudarek na kakovosti programov',
      description:
        'Na platformi spodbujamo izvajanje strokovno utemeljenih in kakovostnih preventivnih programov. Vse objavljene vsebine so pregledno predstavljene, kar omogoča lažjo primerjavo med ponudniki ter informirano izbiro programov, ki najbolje ustrezajo potrebam šol.',
    },
    {
      icon: Network,
      title: 'Širok nabor ponudnikov',
      description:
        'Na naši platformi najdete delavnice iz najrazličnejših tematskih področij, pomembnih za otroke in mladostnike. Programi prihajajo od preverjenih ponudnikov iz vseh koncev Slovenije, kar omogoča bogato in raznoliko izbiro vsebin za vsako šolo.',
    },
    {
      icon: Zap,
      title: 'Prihranek časa in energije',
      description:
        'Uporaba naše platforme vam omogoča lažje in hitrejše brskanje med dostopnimi programi na enem mestu.',
    },
    {
      icon: MessageCircle,
      title: 'Povratne informacije predhodnih uporabnikov',
      description:
        'Prek naše platforme lahko preverite mnenje predhodnih uporabnikov posameznih programov.',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">
          Prednosti
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {prednosti.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Icon */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrednostiOPlatformiSection;

