import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { submitContactForm } from '../api/contact';
import type { ContactFormData } from '../types';
// import contactHeroImage from '../assets/images/contact-hero.jpg'; // Uncomment and import your image
// import workshopsImage from '../assets/images/workshops-banner.jpg'; // Uncomment and import your image for the workshops banner

const Kontakt = () => {
  const navigate = useNavigate();
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      alert('Sporočilo je bilo uspešno poslano!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: () => {
      alert('Napaka pri pošiljanju sporočila. Poskusite ponovno.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)', // Replace with: url('${contactHeroImage}')
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-primary">delavnice</span>
              <span className="text-white">.net</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
            V primeru kakršnih koli vprašanj ali težav nas kontaktirajte prek spodnjega obrazca.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Kontakt
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-16">
          <div>
            <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
              Ime
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
              E-pošta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-base font-medium text-gray-700 mb-2">
              Zadeva
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">
              Vaše sporočilo
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Pošiljanje...' : 'Pošlji'}
            </button>
          </div>
        </form>

        {/* Workshops Banner with Hover Effect */}
        <div 
          className="relative h-[200px] rounded-lg overflow-hidden shadow-lg mb-16 cursor-pointer group"
          onClick={() => navigate('/delavnice')}
          onMouseEnter={() => setIsHoveringBanner(true)}
          onMouseLeave={() => setIsHoveringBanner(false)}
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80)', // Replace with: url('${workshopsImage}')
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            {!isHoveringBanner ? (
              <h3 className="text-3xl md:text-4xl font-bold text-white transition-opacity duration-300">
                Delavnice, programi, tečaji ...
              </h3>
            ) : (
              <div className="flex items-center gap-4 transition-all duration-300">
                <h3 className="text-3xl md:text-4xl font-bold text-white">
                  Poglej ponudbo tukaj
                </h3>
                <svg 
                  className="w-10 h-10 text-white animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Map and Contact Information Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="rounded-lg overflow-hidden shadow-lg h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2768.6594689456696!2d14.505350776741856!3d46.05108597121234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47652d64e6dd4f5d%3A0x5d5b4e8c3c3c3c3c!2sLjubljana!5e0!3m2!1sen!2ssi!4v1234567890123!5m2!1sen!2ssi"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>

          {/* Contact Information Cards */}
          <div className="space-y-8">
            {/* Platform Manager */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Naročnik platforme</h3>
              <p className="text-lg text-gray-700 mb-4">Trenerska akademija</p>
              <a 
                href="mailto:info@delavnice.net" 
                className="text-primary hover:text-primary/80 transition-colors text-lg"
              >
                info@delavnice.net
              </a>
            </div>

            {/* Platform Administrator */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upravitelj platforme</h3>
              <p className="text-lg text-gray-700 mb-4">ADO, Agencija za družbeno odgovornost</p>
              <a 
                href="mailto:info@ado.si" 
                className="text-primary hover:text-primary/80 transition-colors text-lg"
              >
                info@ado.si
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kontakt;
