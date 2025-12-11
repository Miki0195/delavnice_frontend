const QualitySection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-8">
            Kako delavnice.net zagotavlja kakovost preventive?
          </h2>

          <p className="text-lg text-gray-800 mb-6 leading-relaxed">
            Platforma delavnice.net si prizadeva za dvig standardov na področju
            preventivnega dela v šolah. To dosegamo s/z:
          </p>

          <ul className="space-y-4 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <div>
                <strong className="text-gray-900">Preglednostjo ponudbe:</strong>{' '}
                <span className="text-gray-700">
                  Na platformi so objavljeni le programi, ki so preverjeni in ustrezajo
                  smernicam učinkovite preventive.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <div>
                <strong className="text-gray-900">Podporo ponudnikom:</strong>{' '}
                <span className="text-gray-700">
                  S treningi, strokovnimi smernicami in oglaševanjem spodbujamo
                  ponudnike k stalnemu izboljševanju programov.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <div>
                <strong className="text-gray-900">Povezovanjem:</strong>{' '}
                <span className="text-gray-700">
                  Omogočamo enostavno povezavo šol z zaupanja vrednimi programi, ki
                  varujejo in podpirajo razvoj otrok in mladostnikov.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <div>
                <strong className="text-gray-900">Lažjo dostopnostjo:</strong>{' '}
                <span className="text-gray-700">
                  S preprosto povezavo med šolami in preverjenimi ponudniki omogočamo
                  hitro in učinkovito izbiro programov, ki najbolje ustrezajo potrebam
                  posameznih šol.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <div>
                <strong className="text-gray-900">Podporo ponudnikom:</strong>{' '}
                <span className="text-gray-700">
                  Z usmerjanjem in smernicami ponudnikom pomagamo pri izboljšanju
                  njihovih programov ter krepitvi strokovnosti, kar dolgoročno prispeva
                  k višji kakovosti na področju preventive.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;

