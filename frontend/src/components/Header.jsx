import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 animate-fade-in-up">
            <button
              onClick={() => scrollToSection('accueil')}
              className="group"
            >
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200" 
                  style={{ fontFamily: 'var(--font-serif)' }}>
                Les Embruns
              </h1>
              <div className="w-0 group-hover:w-full h-0.5 bg-gray-900 transition-all duration-300"></div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 animate-fade-in-up stagger-2">
            {[
              { id: 'accueil', label: 'Accueil' },
              { id: 'a-propos', label: 'À Propos' },
              { id: 'menu', label: 'Menu' },
              { id: 'galerie', label: 'Galerie' },
              { id: 'contact', label: 'Contact' }
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Phone number */}
          <div className="hidden md:flex items-center space-x-3 animate-fade-in-up stagger-3">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200">
              05 46 66 46 31
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/50 animate-fade-in">
            <div className="px-2 pt-4 pb-6 space-y-2">
              {[
                { id: 'accueil', label: 'Accueil' },
                { id: 'a-propos', label: 'À Propos' },
                { id: 'menu', label: 'Menu' },
                { id: 'galerie', label: 'Galerie' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 border-t border-gray-200 mt-4 pt-4">
                <Phone className="h-4 w-4" />
                <span className="font-medium">05 46 66 46 31</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;