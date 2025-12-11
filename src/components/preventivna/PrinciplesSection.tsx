import {
  BookOpen,
  Users,
  Target,
  Clock,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

const PrinciplesSection = () => {
  const principles = [
    {
      icon: BookOpen,
      title: 'Temelji na znanosti',
      description:
        'Programi morajo izhajati iz preverjenih in znanstveno utemeljenih pristopov, ki dokazano prinašajo pozitivne rezultate.',
    },
    {
      icon: Target,
      title: 'Celosten pristop',
      description:
        'Uspešne preventivne dejavnosti obravnavajo različne vidike otrokovega in mladostnikovega razvoja, vključno z njihovimi čustvenimi, socialnimi in kognitivnimi potrebami.',
    },
    {
      icon: Users,
      title: 'Vključenost celotne skupnosti',
      description:
        'Učinkovita preventiva vključuje starše, učitelje, vrstnike in širšo skupnost ter poudarja sodelovanje in podporo na vseh ravneh. Prilagodljivost starosti: Programi morajo biti prilagojeni starostni skupini, za katero so namenjeni, ter upoštevati razvojne značilnosti otrok in mladostnikov.',
    },
    {
      icon: TrendingUp,
      title: 'Prilagodljivost starosti',
      description:
        'Programi morajo biti prilagojeni starostni skupini, za katero so namenjeni, ter upoštevati razvojne značilnosti otrok in mladostnikov. Dolgotrajna podpora: Preventivni učinki so najučinkovitejši, ko so aktivnosti kontinuirane in podprte z dolgoročnimi strategijami.',
    },
    {
      icon: Clock,
      title: 'Dolgotrajna podpora',
      description:
        'Preventivni učinki so najučinkovitejši, ko so aktivnosti kontinuirane in podprte z dolgoročnimi strategijami.',
    },
    {
      icon: UserCheck,
      title: 'Interaktivnost in aktivnost udeležencev',
      description:
        'Programi, ki vključujejo interaktivne metode in spodbujajo aktivno sodelovanje udeležencev, so bistveno bolj učinkoviti.',
    },
    {
      icon: TrendingUp,
      title: 'Večkratnost intervencij',
      description:
        'Posamezna aktivnost redko zadostuje; uspešna preventiva temelji na ponavljajočih se intervencijah, ki utrjujejo sporočila in pozitivne vedenjske vzorce.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">
            Načela učinkovite preventive
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;

