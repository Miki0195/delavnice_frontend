import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoriesData } from '../../data/categoriesData';

const CategoriesCarouselSection = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categoriesData[0]?.id || null
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categoriesData.find((cat) => cat.id === selectedCategoryId);
  const currentIndex = categoriesData.findIndex((cat) => cat.id === selectedCategoryId);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % categoriesData.length;
      const nextCategory = categoriesData[nextIndex];
      setSelectedCategoryId(nextCategory.id);
      
      // Scroll to center the next category
      scrollToCategory(nextIndex);
    }, 100000); // Change every 1 minute

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  // Function to scroll a specific category to center
  const scrollToCategory = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const categoryWidth = 320 + 24; // width (80*4) + gap (6*4)
    const containerWidth = container.clientWidth;
    const scrollPosition = (index * categoryWidth) - (containerWidth / 2) + (categoryWidth / 2);
    
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  // Handle category click - center if partially visible
  const handleCategoryClick = (categoryId: string, index: number) => {
    setSelectedCategoryId(categoryId);
    setIsAutoPlaying(false); // Pause auto-play on manual interaction
    scrollToCategory(index);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const scrollLeft = () => {
    setIsAutoPlaying(false); // Pause auto-play
    
    // Move to previous category
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : categoriesData.length - 1;
    const prevCategory = categoriesData[prevIndex];
    setSelectedCategoryId(prevCategory.id);
    scrollToCategory(prevIndex);
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const scrollRight = () => {
    setIsAutoPlaying(false); // Pause auto-play
    
    // Move to next category
    const nextIndex = (currentIndex + 1) % categoriesData.length;
    const nextCategory = categoriesData[nextIndex];
    setSelectedCategoryId(nextCategory.id);
    scrollToCategory(nextIndex);
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Kategorije
        </h2>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {categoriesData.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, index)}
                className={`flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-300 ${
                  selectedCategoryId === category.id
                    ? 'ring-4 ring-white scale-105'
                    : 'hover:scale-105'
                }`}
              >
                {/* Background Image - Placeholder */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800"
                  style={{
                    backgroundImage: `url(${category.imageName})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                {/* Title */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h3 className="text-2xl font-bold text-white text-center">
                    {category.title}
                  </h3>
                </div>

                {/* Selected Indicator */}
                {selectedCategoryId === category.id && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-1 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {categoriesData.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedCategoryId === category.id
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to ${category.title}`}
              />
            ))}
          </div>
        </div>

        {/* Selected Category Content */}
        {selectedCategory && (
          <div className="max-w-5xl mx-auto mt-16">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-primary mb-6">
                {selectedCategory.title}
              </h3>
              <div className="prose prose-lg max-w-none">{selectedCategory.content}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesCarouselSection;

