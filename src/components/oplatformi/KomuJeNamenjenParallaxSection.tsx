import { School, Briefcase } from 'lucide-react';

// TODO: Import the actual background image here
// import komuJeNamenjenBg from '../../assets/images/komu-je-namenjen-bg.jpg';

const KomuJeNamenjenParallaxSection = () => {
  return (
    <section
      className="py-20 md:py-32 mb-16 md:mb-24 relative overflow-hidden"
      style={{
        // TODO: Add background image once available
        // backgroundImage: `url(${komuJeNamenjenBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // This creates the parallax/fixed effect
        backgroundColor: '#34495e', // Fallback dark background
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          Komu je namenjen?
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* ZA ŠOLE */}
          <div className="text-white">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
                <School className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-center">ŠOLE</h3>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-center md:text-left">
              Izobraževalne ustanove lahko prek platforme dostopajo do celovitega in
              preglednega seznama preverjenih ter visoko kakovostnih programov za
              učence in dijake. S tem imajo možnost enostavne izbire programov, ki
              najbolje ustrezajo njihovim specifičnim potrebam in ciljem. Platforma
              poenostavi proces iskanja, saj omogoča hitro in neposredno povezavo z
              različnimi ponudniki programov, brez potrebe po dodatnem brskanju po
              spletu, kar prihrani čas in zagotavlja zanesljivost izbranih vsebin.
            </p>
          </div>

          {/* ZA PONUDNIKE */}
          <div className="text-white">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-center">
                PONUDNIKI PROGRAMOV ZA OTROKE IN MLADE
              </h3>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-center md:text-left">
              Prek platforme lahko izvajalci različnih programov, namenjenih učencem
              in dijakom, na enostaven in učinkovit način predstavijo svoje programe
              osnovnim in srednjim šolam po vsej Sloveniji. Poleg tega platforma
              ponudnikom zagotavlja dodatno podporo, kot so treningi za izboljšanje
              kakovosti njihovih programov ter oglaševanje v okviru platforme, kar
              prispeva k večji prepoznavnosti in dostopnosti njihovih storitev.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KomuJeNamenjenParallaxSection;

