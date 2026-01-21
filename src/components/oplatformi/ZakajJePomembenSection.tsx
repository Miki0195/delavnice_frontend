import { Shield, Users, CheckCircle } from 'lucide-react';

const ZakajJePomembenSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">
            Zakaj je portal pomemben?
          </h2>

          <div className="space-y-8">
            {/* First paragraph with icon */}
            <div className="flex gap-6 items-start bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed flex-1">
                Otroci in mladi v šoli preživijo velik del časa prav v letih, ko se oblikujejo 
                njihova prepričanja, vrednote in vedenjski vzorci. Zato ima šola poleg izobraževalne 
                tudi pomembno preventivno in vzgojno vlogo, zlasti pri temah, ki jih formalni učni 
                načrti ne pokrivajo.
              </p>
            </div>

            {/* Second paragraph with icon */}
            <div className="flex gap-6 items-start bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                <Shield className="w-7 h-7 text-orange-600" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed flex-1">
                Preventivni in drugi programi neformalnega izobraževanja so pomemben del celostne 
                podpore mladim, vendar pa na tem področju pogosto primanjkuje enotnih standardov in 
                preglednosti. Posledično v šole vstopajo tudi programi, ki jih izvajajo neustrezno 
                usposobljeni posamezniki, kar lahko mladim v občutljivem obdobju razvoja povzroča več 
                škode kot koristi.
              </p>
            </div>

            {/* Third paragraph with icon */}
            <div className="flex gap-6 items-start bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed flex-1">
                Portal <strong className="text-primary">delavnice.net</strong> ponuja zanesljive in 
                pregledne informacije o preverjenih programih ter s tem pomaga šolam pri izbiri 
                kakovostnih vsebin, podpira organizacije pri transparentnem delovanju in predvsem 
                varuje dobrobit otrok in mladih.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZakajJePomembenSection;
