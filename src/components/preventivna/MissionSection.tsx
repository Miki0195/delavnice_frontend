import { Filter, Zap, CheckCircle, Clock } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
            Naše poslanstvo
          </h2>

          <p className="text-xl text-gray-800 mb-12 leading-relaxed font-medium text-center max-w-4xl mx-auto">
            Delavnice.net so več kot iskalnik; so sistem, ki gradi bolj zdravo in
            varno šolsko okolje, kjer je preventiva enostavna in standardna praksa.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Filter za kakovost Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Filter className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Filter za kakovost
                </h3>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Trg je poln z nepreverjenimi ponudniki – delavnice.net poskrbijo, da
                v šole pridejo vsebine, katerih kakovost je razvidna skozi
                transparentne ocene in preverjenost s strani uporabnikov.
              </p>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-l-4 border-primary">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-base text-gray-800">
                  Šolam ponujamo jasen sistem ocen in mnenj, ki krepi zaupanje ter
                  odgovornost izvajalcev.
                </p>
              </div>
            </div>

            {/* Orodje za učinkovitost Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Orodje za učinkovitost
                </h3>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Namesto izgubljenih ur z iskanjem, klicanjem in usklajevanjem,
                delavnice.net celoten proces avtomatizira in centralizira.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-l-4 border-primary">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-gray-800">
                    Šole z nekaj kliki dostopajo do preverjenih programov, rezervacij in
                    dokumentacije.
                  </p>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-l-4 border-primary">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-gray-800">
                    Izvajalcem platforma služi kot glavni tržni in administrativni kanal,
                    ki jim omogoča fokus na vsebino.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

