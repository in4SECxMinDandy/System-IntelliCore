'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

// Language options
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname or localStorage
  useEffect(() => {
    // Check localStorage first
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) setCurrentLang(lang);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      const lang = languages.find(l => l.code === browserLang);
      if (lang) {
        setCurrentLang(lang);
        localStorage.setItem('language', lang.code);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang.code);
    setIsOpen(false);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languagechange', { detail: lang.code }));
    
    // Optionally reload or redirect - for now just update state
    // In a full implementation, you might want to redirect to the localized path
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                   text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800
                   transition-colors duration-200"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
        <span className="hidden md:inline">{currentLang.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-900 rounded-lg 
                        shadow-lg border border-gray-200 dark:border-dark-700 py-1 z-50
                        animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                         hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors
                         ${currentLang.code === lang.code 
                           ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                           : 'text-gray-700 dark:text-gray-300'}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {currentLang.code === lang.code && (
                <span className="ml-auto text-primary-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
