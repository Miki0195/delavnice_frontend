import MissionSection from '../components/preventivna/MissionSection';
import WhyImportantSection from '../components/preventivna/WhyImportantSection';
import PrinciplesSection from '../components/preventivna/PrinciplesSection';
import ChallengesSection from '../components/preventivna/ChallengesSection';
import QualitySection from '../components/preventivna/QualitySection';
import VisionSection from '../components/preventivna/VisionSection';
import CategoriesCarouselSection from '../components/preventivna/CategoriesCarouselSection';
// import ReferencesSection from '../components/preventivna/ReferencesSection';

const PreventivnaZnanost = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Intro Text */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-8">
              Izzivi na področju preventive
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Kljub temu, da so načela učinkovite preventive dobro raziskana in
              podprta z znanstvenimi dokazi, se v praksi pogosto soočamo z izvajanjem
              programov, ki temeljijo na neučinkovitih ali zastarelih pristopih.
              Prihaja do neupoštevanja znanstveno dokazanih smernic, zanašanja na
              metode, ki nimajo preverjenih rezultatov, vključevanje nepoučenih
              izvajalcev itd. Posledično lahko takšni programi ne le, da ne
              prispevajo k preprečevanju tveganih vedenj, temveč celo ustvarjajo
              napačne predstave, zmanjšujejo zaupanje v preventivne aktivnosti in
              ogrožajo zdrav razvoj otrok in mladostnikov. Prav zato je nujno, da se
              na tem področju vzpostavijo standardi kakovosti, ki bodo zagotavljali,
              da so vsi preventivni programi zasnovani in izvedeni v skladu z
              znanstvenimi smernicami ter z mislijo na dolgoročno dobrobit mladih.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <MissionSection />

      {/* Why Important - Parallax Section */}
      <WhyImportantSection />

      {/* Principles Section */}
      <PrinciplesSection />

      {/* Challenges Section */}
      <ChallengesSection />

      {/* Quality Section */}
      <QualitySection />

      {/* Vision Section */}
      <VisionSection />

      {/* Categories Carousel - Moved from Domov */}
      <CategoriesCarouselSection />

      {/* References Section */}
      {/* <ReferencesSection /> */}
    </div>
  );
};

export default PreventivnaZnanost;

