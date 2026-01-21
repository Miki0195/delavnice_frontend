import { Check } from 'lucide-react';

const ZakajTaPortalSection = () => {
  const reasons = [
    <>ker <span className="font-semibold text-primary">zmanjšuje administrativno breme</span> pri iskanju, primerjanju in preverjanju izvajalcev</>,
    <>ker <span className="font-semibold text-primary">poenostavi iskanje in izbor programov</span> za šole na enem mestu</>,
    <>ker omogoča dostop do <span className="font-semibold text-primary">preverjenih, kakovostnih in strokovno utemeljenih vsebin</span></>,
    <>ker prispeva k <span className="font-semibold text-primary">večji preglednosti</span> na področju preventivnih programov</>,
    <>ker ščiti <span className="font-semibold text-primary">dobrobit otrok in mladih</span> pred neustreznimi ali nestrokovnimi vsebinami</>,
    <>ker krepi <span className="font-semibold text-primary">zaupanje med šolami, izvajalci in financerji</span></>,
    <>ker spodbuja <span className="font-semibold text-primary">kakovost, standarde in dolgoročno učinkovitost</span> programov</>,
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-8">
            Zakaj ta portal?
          </h2>

          <div className="space-y-4">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZakajTaPortalSection;

