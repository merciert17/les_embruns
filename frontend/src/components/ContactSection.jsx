import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { restaurantApi } from '../services/api';
import { SectionLoader } from './LoadingSpinner';

const ContactSection = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const data = await restaurantApi.getRestaurantInfo();
        setContactData(data.contact);
      } catch (err) {
        setError('Erreur lors du chargement des informations de contact');
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handlePhoneClick = () => {
    if (contactData?.phone) {
      window.location.href = `tel:${contactData.phone}`;
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <SectionLoader message="Chargement des informations de contact..." />
      </section>
    );
  }

  if (error || !contactData) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Contact</h2>
          <p className="text-sm sm:text-base text-gray-600">Informations temporairement indisponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Contact
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto mb-8"></div>
          </div>
          <div className="animate-fade-in-up stagger-2">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Réservez votre table pour une expérience culinaire inoubliable proche de la mer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="card-white animate-slide-in-left stagger-3 group hover:shadow-2xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Téléphone
                  </h3>
                  <button
                    onClick={handlePhoneClick}
                    className="text-lg sm:text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-200 underline decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    {contactData.phone}
                  </button>
                  <p className="text-sm sm:text-base text-gray-600 mt-3">
                    Appelez-nous pour réserver votre table
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card-white animate-slide-in-left stagger-4 group hover:shadow-2xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Adresse
                  </h3>
                  <p className="text-sm sm:text-lg text-gray-700 font-medium">
                    {contactData.address}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mt-3">
                    Au cœur du port de Saint Martin de Ré
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="card-white animate-slide-in-left stagger-5 group hover:shadow-2xl">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
                    Horaires d'Ouverture
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm md:text-base">
                    {Object.entries(contactData.hours).map(([day, hours]) => {
                      const dayNames = {
                        monday: 'Lundi',
                        tuesday: 'Mardi', 
                        wednesday: 'Mercredi',
                        thursday: 'Jeudi',
                        friday: 'Vendredi',
                        saturday: 'Samedi',
                        sunday: 'Dimanche'
                      };
                      
                      const isClosed = hours === 'Fermé';
                      
                      return (
                        <div key={day} className="flex justify-between items-center py-1 whitespace-nowrap">
                          <span className="text-gray-700 font-medium">{dayNames[day]}</span>
                          <span className={`font-medium ${isClosed ? 'text-red-600' : 'text-gray-900'}`}>
                            {hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Card with Google Map */}
          <div className="animate-slide-in-right stagger-3">
            <div className="card-white h-full min-h-96 relative overflow-hidden">
              <div className="relative z-10 text-center h-full flex flex-col justify-center p-8">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Vue sur le Port
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                    Situé au cœur du port de Saint Martin de Ré, notre restaurant vous offre une vue imprenable sur la mer et les bateaux de pêche.
                  </p>

                  {/* Google Map */}
                  <div className="w-full h-64 rounded-xl overflow-hidden shadow-md mb-6">
                    <iframe
                      title="Google Map"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(contactData.address)}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handlePhoneClick}
                    className="btn-primary w-full text-base sm:text-lg py-4 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Réserver Maintenant
                  </button>
                  
                  <div className="flex items-center justify-center space-x-2 text-gray-600 text-xs sm:text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{contactData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-20 text-center animate-fade-in-up stagger-6">
          <div className="card-white inline-block">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Informations Pratiques
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs sm:text-sm">
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Parking</h5>
                <p className="text-gray-600">Disponible à proximité</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Accessibilité</h5>
                <p className="text-gray-600">PMR accessible</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Terrasse</h5>
                <p className="text-gray-600">Vue mer disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
