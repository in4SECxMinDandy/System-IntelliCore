'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get current language from localStorage or browser
  useEffect(() => {
    const savedLang = localStorage.getItem('intellicore-lang');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) setCurrentLang(lang);
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

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('intellicore-lang', lang.code);
    setIsOpen(false);
    
    // Update document lang attribute
    document.documentElement.lang = lang.code;
    
    // Trigger custom event for components to listen
    window.dispatchEvent(new CustomEvent('languagechange', { detail: lang.code }));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "text-sm font-medium",
          "text-gray-600 dark:text-gray-300",
          "hover:bg-gray-100 dark:hover:bg-dark-800",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500"
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
        <span className="hidden md:inline">{currentLang.name}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-40",
            "bg-white dark:bg-dark-900",
            "border border-gray-200 dark:border-dark-700",
            "rounded-lg shadow-lg",
            "py-1 z-50",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5",
                "text-sm text-left",
                "hover:bg-gray-100 dark:hover:bg-dark-800",
                "transition-colors duration-150",
                currentLang.code === lang.code && [
                  "bg-primary-50 dark:bg-primary-900/20",
                  "text-primary-600 dark:text-primary-400",
                  "font-medium"
                ]
              )}
              role="option"
              aria-selected={currentLang.code === lang.code}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLang.code === lang.code && (
                <span className="ml-auto text-primary-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
