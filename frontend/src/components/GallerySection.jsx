import React from 'react';
import { SectionLoader } from './LoadingSpinner';

// images locales - uniquement celles qui commencent par "galery_"
import gal1 from '../assets/images/galery_1.jpg';
import gal2 from '../assets/images/galery_2.jpg';
import gal3 from '../assets/images/galery_3.jpg';
import gal4 from '../assets/images/galery_4.jpg';

const LOCAL_GALLERY = [
  { id: 1, image: gal1, alt: 'Fruits de mer raffinés' },
  { id: 4, image: gal4, alt: 'Restaurant accueillant' },
  { id: 3, image: gal3, alt: 'Ambiance élégante' },
  { id: 2, image: gal2, alt: 'Fondant au chocolat' },
];

const GallerySection = () => {
  const galleryData = LOCAL_GALLERY;

  if (!galleryData || !galleryData.length) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <SectionLoader message="Chargement de la galerie..." />
      </section>
    );
  }

  return (
    <section id="galerie" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Galerie</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto mb-8"></div>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Plongez dans l'univers des Embruns à travers nos créations culinaires et notre cadre exceptionnel
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {galleryData.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-xl shadow-lg">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-60 sm:h-80 object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center">
                  <p className="text-white text-lg font-medium mb-4">{item.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA pour grand écran (au centre) */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-2xl text-center p-4 sm:p-6 max-w-[80%] sm:max-w-md w-auto pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Découvrez l'Expérience Complète
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-base">
              Réservez votre table pour vivre ces moments d'exception en personne
            </p>
            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-xs sm:text-lg px-4 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-300"
            >
              Réserver Maintenant
            </button>
          </div>
        </div>
      </div>

      {/* CTA pour petit écran (sous la grille) */}
      <div className="flex sm:hidden justify-center mt-6">
        <div className="bg-white/75 backdrop-blur-sm rounded-xl shadow-2xl text-center p-4 max-w-[90%] w-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Découvrez l'Expérience Complète
          </h3>
          <p className="text-gray-600 mb-3 text-xs">
            Réservez votre table pour vivre ces moments d'exception en personne
          </p>
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-xs px-4 py-2 hover:scale-105 transition-all duration-300"
          >
            Réserver Maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
