import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoriesData } from '../../data/categoriesData';

const CategoriesCarouselSection = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categoriesData[0]?.id || null
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categoriesData.find((cat) => cat.id === selectedCategoryId);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
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
          >
            {categoriesData.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden relative group cursor-pointer transition-transform ${
                  selectedCategoryId === category.id
                    ? 'ring-4 ring-white scale-105'
                    : 'hover:scale-105'
                }`}
              >
                {/* Background Image - Placeholder */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800"
                  style={{
                    // TODO: Add actual background images here
                    // backgroundImage: `url(/images/categories/${category.imageName})`,
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
            {categoriesData.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
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

