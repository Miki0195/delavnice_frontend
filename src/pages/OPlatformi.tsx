import KajSoDelavniceSection from '../components/oplatformi/KajSoDelavniceSection';
import ZakajTaPortalSection from '../components/oplatformi/ZakajTaPortalSection';
import PrednostiOPlatformiSection from '../components/oplatformi/PrednostiOPlatformiSection';
import KomuJeNamenjenParallaxSection from '../components/oplatformi/KomuJeNamenjenParallaxSection';
import KakoDelajeSection from '../components/oplatformi/KakoDelajeSection';
import ZakajJePomembenSection from '../components/oplatformi/ZakajJePomembenSection';
// import KomuJeNamenjenSection from '../components/oplatformi/KomuJePortalNamenjenSection';
import KdoGaUpravljaSection from '../components/oplatformi/KdoGaUpravljaSection';
import MnenjaUporabnikovSection from '../components/oplatformi/MnenjaUporabnikovSection';

const OPlatformi = () => {
  return (
    <div className="min-h-screen">
      {/* Hero / Introduction */}
      <KajSoDelavniceSection />

      {/* Why This Portal */}
      <ZakajTaPortalSection />

      {/* Benefits - Moved from Domov */}
      <PrednostiOPlatformiSection />

      {/* Who Is It For - Parallax Section */}
      <KomuJeNamenjenParallaxSection />

      {/* Who Is It For - Detail Section */}
      {/* <KomuJeNamenjenSection /> */}

      {/* How Does It Work */}
      <KakoDelajeSection />

      {/* Why Is The Portal Important */}
      <ZakajJePomembenSection />

      {/* Who Manages Quality */}
      <KdoGaUpravljaSection />

      {/* Testimonials - Moved from Domov */}
      <MnenjaUporabnikovSection />
    </div>
  );
};

export default OPlatformi;

