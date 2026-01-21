import { FileText, CreditCard, Copyright, AlertCircle, RefreshCw, Mail } from 'lucide-react';

const PogojiUporabe = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Pogoji uporabe</h1>
                <p className="text-gray-600 mt-2">Zadnja posodobitev: Januar 2026</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Z obiskom in uporabo spletne strani delavnice.net soglašate s spodaj navedenimi pogoji uporabe.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Splošno</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Spletno mesto delavnice.net upravlja zavod Trenerska akademija. Namen strani je informiranje 
                    in omogočanje prijave na izobraževalne, mladinske delavnice.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Prijave in plačila</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p>
                        Prijava na delavnice poteka prek spletnega obrazca na spletni strani.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p>
                        Plačilo se izvede po prejemu potrditve prijave, skladno z navodili, ki jih prejmete po e-pošti.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p>
                        V primeru odpovedi s strani organizatorja se vplačilo v celoti povrne. V primeru odpovedi 
                        s strani udeleženca veljajo pogoji odpovedi, navedeni ob posamezni delavnici.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Avtorske pravice</h2>
                  <div className="flex items-start gap-3">
                    <Copyright className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-gray-700">
                      Vse vsebine (besedila, slike, gradiva) na spletni strani so zaščitene z avtorskimi pravicami. 
                      Brez predhodnega pisnega dovoljenja jih ni dovoljeno kopirati, razmnoževati ali kakorkoli 
                      uporabljati v komercialne namene.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Odgovornost</h2>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-gray-700">
                      Zavezujemo se k ažurnosti in točnosti informacij, vendar ne prevzemamo odgovornosti za 
                      morebitne napake ali nedostopnost spletne strani.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Spremembe pogojev</h2>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-gray-700">
                      Pridržujemo si pravico do spremembe pogojev uporabe brez predhodnega obvestila. Uporabnikom 
                      svetujemo, da jih redno spremljajo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Pomembno</h3>
                <p className="text-blue-800">
                  Z registracijo in uporabo spletne strani potrjujete, da ste prebrali in razumeli te pogoje 
                  uporabe ter se z njimi strinjate.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-gradient-to-r from-primary to-cyan-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Imate vprašanja?</h3>
            <p className="text-lg mb-4">
              Za dodatna vprašanja se lahko obrnete na našo e-pošto.
            </p>
            <a
              href="mailto:info@delavnice.net"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5" />
              info@delavnice.net
            </a>
          </div>
        </div>
      </div>
  );
};

export default PogojiUporabe;
