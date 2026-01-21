import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  maxKeywords?: number;
  maxKeywordLength?: number;
  placeholder?: string;
}

const KeywordInput = ({
  keywords,
  onChange,
  maxKeywords = 10,
  maxKeywordLength = 40,
  placeholder = 'Vnesite ključno besedo in pritisnite Enter',
}: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addKeyword = (value: string) => {
    const candidate = value.trim();
    
    // Clear any previous error
    setError('');

    // Validate
    if (!candidate) {
      return;
    }

    if (candidate.length > maxKeywordLength) {
      setError(`Ključna beseda ne sme presegati ${maxKeywordLength} znakov.`);
      return;
    }

    if (keywords.length >= maxKeywords) {
      setError(`Največje število ključnih besed je ${maxKeywords}.`);
      return;
    }

    // Check for duplicate (case-insensitive)
    if (keywords.some(kw => kw.toLowerCase() === candidate.toLowerCase())) {
      setError('Ta ključna beseda je že dodana.');
      return;
    }

    // Add keyword
    onChange([...keywords, candidate]);
    setInputValue('');
  };

  const removeKeyword = (index: number) => {
    onChange(keywords.filter((_, i) => i !== index));
    setError('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter or comma commits the keyword
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(inputValue);
    }
    // Tab commits the keyword
    else if (e.key === 'Tab' && inputValue.trim()) {
      e.preventDefault();
      addKeyword(inputValue);
    }
    // Backspace on empty input removes last chip
    else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      e.preventDefault();
      removeKeyword(keywords.length - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if comma was typed
    if (value.includes(',')) {
      const parts = value.split(',');
      const toAdd = parts[0];
      addKeyword(toAdd);
      // Keep remaining text after comma
      setInputValue(parts.slice(1).join(',').trim());
    } else {
      setInputValue(value);
      setError('');
    }
  };

  const handleBlur = () => {
    // Commit on blur if there's text
    if (inputValue.trim()) {
      addKeyword(inputValue);
    }
  };

  return (
    <div>
      <div className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Keyword chips */}
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
            >
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${keyword}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Input field */}
          {keywords.length < maxKeywords && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={keywords.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[200px] outline-none bg-transparent"
            />
          )}
        </div>
      </div>

      {/* Instructions and counter */}
      <div className="mt-1 flex items-start justify-between gap-2">
        <p className="text-xs text-gray-500">
          Pritisnite <span className="font-semibold">Enter</span>, <span className="font-semibold">vejico (,)</span> ali <span className="font-semibold">Tab</span> za ločevanje ključnih besed.
        </p>
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {keywords.length}/{maxKeywords}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default KeywordInput;
