import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { REGIONS } from '../../types';

interface HeroSectionProps {
  onSearch: (query: string, region?: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const staticText = 'Poiščite svojo delavnico';
  const animatedTexts = [
    'po vsebini',
    'po regiji',
    'po oceni',
  ];

  // Typewriter effect
  useEffect(() => {
    const currentText = animatedTexts[textIndex];
    const typingSpeed = isDeleting ? 50 : 100; // Faster when deleting
    const pauseAfterComplete = 2000; // Pause after typing complete text
    const pauseAfterDelete = 500; // Pause after deleting

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
          // Text complete, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseAfterComplete);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        } else {
          // Deletion complete, move to next text
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % animatedTexts.length);
          setTimeout(() => {}, pauseAfterDelete);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedRegion);
  };

  return (
    <section className="bg-gray-dark text-white py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Typewriter Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 min-h-[120px] flex items-center justify-center">
          <span>
            {staticText}{' '}
            <span className="text-primary">
              {displayText}
              <span
                className={`inline-block w-1 h-12 bg-primary ml-1 ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transition: 'opacity 0.1s' }}
              />
            </span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-center text-gray-300 mb-10">
          Raziščite kakovostne in preverjene delavnice, programe, tečaje in še več!
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row gap-2">
          {/* Keyword Input */}
          <div className="flex-1 flex items-center px-4">
            <input
              type="text"
              placeholder="Ključne besede"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300 my-2" />

          {/* Region Dropdown */}
          <div className="flex-1 flex items-center px-4">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full py-3 text-gray-900 focus:outline-none bg-transparent cursor-pointer appearance-none"
            >
              <option value="">Regije</option>
              {REGIONS.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Iskanje</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
