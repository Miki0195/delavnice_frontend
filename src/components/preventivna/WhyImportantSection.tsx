const WhyImportantSection = () => {
  return (
    <section
      className="py-16 relative"
      style={{
        backgroundImage: 'url(/path-to-background-image.jpg)', // TODO: Add background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#4a5568', // Fallback
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Zakaj je preventivna znanost pomembna?
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Otroštvo in mladost sta ključni obdobji v človekovem razvoju, ko se
              oblikujejo vrednote, navade in vedenjski vzorci, ki vplivajo na
              kakovost življenja v odrasli dobi. Preventivna znanost temelji na
              raziskavah, ki dokazujejo, da lahko dobro načrtovane in izvedene
              preventivne dejavnosti zmanjšajo tveganja za razvoj različnih težav,
              kot so odvisnosti, nasilje, težave v duševnem zdravju in drugi škodljivi
              vedenjski vzorci.Cilj je{' '}
              <strong>
                podpirati otroke in mladostnike pri oblikovanju zdravih, pozitivnih
                izbir in navad
              </strong>
              , ki jim omogočajo kakovostno in polno življenje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyImportantSection;

