import { Star } from 'lucide-react';

const MnenjaUporabnikovSection = () => {
  const testimonials = [
    {
      quote:
        'Platforma delavnice.net nam je omogočila hitro in enostavno iskanje kakovostnih preventivnih programov za naše učence. Prihranili smo ogromno časa pri iskanju ustreznih ponudnikov.',
      author: 'Marija Novak',
      role: 'Ravnateljica OŠ Ljubljana Center',
      rating: 5,
    },
    {
      quote:
        'Kot ponudnik programov za mlade sem zelo zadovoljen s platformo. Omogočila mi je, da dosežem več šol po vsej Sloveniji in predstavim svoj program širši publiki.',
      author: 'Peter Krajnc',
      role: 'Direktor, NPO Mladi za jutri',
      rating: 5,
    },
    {
      quote:
        'Odlična preglednost in možnost primerjave različnih programov. Končno imamo vse informacije zbrane na enem mestu. Toplo priporočam vsem šolam!',
      author: 'Ana Horvat',
      role: 'Šolska svetovalka, Gimnazija Maribor',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">
          Mnenja uporabnikov
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MnenjaUporabnikovSection;

