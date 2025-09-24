import React, { useState, useEffect } from 'react';
import { restaurantApi } from '../services/api';
import { SectionLoader } from './LoadingSpinner';

const HeroSection = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await restaurantApi.getRestaurantInfo();
        setHeroData(data.hero);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <SectionLoader message="Chargement de la page d'accueil..." />
      </section>
    );
  }

  if (error || !heroData) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Les Embruns</h1>
          <p className="text-gray-600">Restaurant Semi-Gastronomique</p>
        </div>
      </section>
    );
  }

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0 parallax">
        <div className="image-hover-zoom h-full">
          <img
            src={heroData.image}
            alt="Vue du restaurant Les Embruns"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 "></div>
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-20 left-20 w-3 h-3 bg-white/30 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-40 right-32 w-4 h-4 bg-white/20 rounded-full animate-float stagger-2 blur-sm"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-white/35 rounded-full animate-float stagger-4 blur-sm"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-white/40 rounded-full animate-float stagger-3 blur-sm"></div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-white/25 rounded-full animate-float stagger-5 blur-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white/15 rounded-full animate-float stagger-6 blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">
            {heroData.title}
          </h1>
        </div>

        <div className="animate-fade-in-up stagger-2">
          <p className="text-xl md:text-3xl lg:text-4xl mb-4 font-light tracking-wide opacity-95 drop-shadow-lg">
            {heroData.subtitle}
          </p>
        </div>

        <div className="animate-fade-in-up stagger-3">
          <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90 drop-shadow-md">
            {heroData.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up stagger-4">
          <button
            onClick={scrollToMenu}
            className="btn-primary hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Découvrir la Carte
          </button>
          <button
            onClick={scrollToContact}
            className="btn-secondary hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <span>Nous Contacter</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator centré en bas de la page */}
      <div className="absolute bottom-8 left-1/0 transform -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center text-white/90">
          <div className="w-8 h-12 border-2 border-white/70 rounded-full flex justify-center mb-3 backdrop-blur-sm bg-white/10">
            <div className="w-1 h-4 bg-white/90 rounded-full mt-3 animate-pulse"></div>
          </div>
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/30 to-transparent z-5"></div>

      {/* Side decorative elements */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
