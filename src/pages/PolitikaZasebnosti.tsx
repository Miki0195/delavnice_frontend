import { Shield, Lock, Mail, Database, UserCheck, FileText } from 'lucide-react';

const PolitikaZasebnosti = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Politika zasebnosti</h1>
                <p className="text-gray-600 mt-2">Zadnja posodobitev: Januar 2026</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Spletna stran delavnice.net se zavezuje k varovanju zasebnosti uporabnikov in k skrbni obdelavi 
              vseh osebnih podatkov skladno z veljavno zakonodajo (ZVOP-2, GDPR).
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4 mb-4">
                <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Katere podatke zbiramo?</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Ime in priimek</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>E-poštni naslov</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Informacije o prijavi (na) delavnice (termin, vrsta delavnice ipd.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>IP-naslov in druge podatke o uporabi spletne strani (piškotki)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4 mb-4">
                <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Namen obdelave osebnih podatkov</h2>
                  <p className="text-gray-700 mb-4">Vaše podatke uporabljamo izključno za:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Obdelavo prijav na delavnice ali objavljene storitve</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Komunikacijo v zvezi z objavljenimi ali rezerviranimi storitvami</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Pošiljanje informacij in novic</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4 mb-4">
                <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hramba podatkov</h2>
                  <p className="text-gray-700">
                    Podatke hranimo le toliko časa, kolikor je potrebno za izpolnitev namena, zaradi katerega 
                    so bili zbrani, oziroma skladno z zakonodajo.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4 mb-4">
                <UserCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Pravice uporabnikov</h2>
                  <p className="text-gray-700 mb-4">Kadarkoli lahko zahtevate:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Dostop do svojih podatkov</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Popravek, izbris ali omejitev obdelave</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Prenos podatkov</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Preklic soglasja (za pošiljanje e-novic)</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-gray-700">
                      Zahteve pošljite na{' '}
                      <a href="mailto:info@delavnice.net" className="text-primary font-semibold hover:underline">
                        info@delavnice.net
                      </a>
                      . Vašo zahtevo bomo obravnavali v najkrajšem možnem času.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4 mb-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Piškotki</h2>
                  <p className="text-gray-700">
                    Spletna stran uporablja nujne in analitične piškotke za izboljšanje uporabniške izkušnje. 
                    Več o tem si lahko preberete v Politiki piškotkov.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-gradient-to-r from-primary to-cyan-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Imate vprašanja?</h3>
            <p className="text-lg mb-4">
              Če imate kakršnakoli vprašanja glede naše politike zasebnosti, nas lahko kontaktirate.
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

export default PolitikaZasebnosti;
