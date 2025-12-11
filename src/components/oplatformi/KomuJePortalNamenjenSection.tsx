import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

// TODO: Import the actual background image here
import komuJeNamenjenImage from '../../assets/images/komu-je-namenjen-img.jpg';

const KomuJeNamenjenSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        // TODO: Add background image once available
        backgroundImage: `url(${komuJeNamenjenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#2c3e50', // Fallback dark background
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Komu je portal namenjen?
              </h2>

              <div className="space-y-6 text-lg leading-relaxed mb-8">
                <p>
                  Namenjen je <strong>šolam</strong>, ki želijo enostavno povezavo z
                  različnimi ponudniki kakovostnih programov brez dodatnega brskanja po
                  spletu …
                </p>

                <p>
                  In <strong>ponudnikom programov za otroke in mlade</strong>, ki želijo
                  svoje storitve na enostaven način ponuditi osnovnim in srednjim šolam
                  po vsej Sloveniji.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/o-platformi')}
              >
                Preberi več ...
              </Button>
            </div>

            {/* Right: Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md w-full">
                {/* TODO: Add the actual image here */}
                <img 
                  src={komuJeNamenjenImage} 
                  alt="Otroci pri aktivnostih" 
                  className="w-full h-auto"
                />
                
                {/* Placeholder until image is added */}
                {/* <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    [Image placeholder]
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KomuJeNamenjenSection;

