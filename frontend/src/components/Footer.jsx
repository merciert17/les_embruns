import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Heart } from 'lucide-react';
import { restaurantApi } from '../services/api';

const Footer = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await restaurantApi.getRestaurantInfo();
        setRestaurantData(data);
      } catch (err) {
        console.error('Error loading restaurant data for footer:', err);
      }
    };

    fetchRestaurantData();
  }, []);

  const handlePhoneClick = () => {
    if (restaurantData?.contact?.phone) {
      window.location.href = `tel:${restaurantData.contact.phone}`;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-float stagger-3"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Restaurant Info */}
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Les Embruns
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4"></div>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-lg">
              {restaurantData?.description || 
                "Restaurant semi-gastronomique au cœur du port de Saint Martin de Ré. Une expérience culinaire raffinée proche de la mer."
              }
            </p>
            
            <div className="flex items-center space-x-2 text-yellow-400">
              <Heart className="h-5 w-5 fill-current animate-pulse" />
              <span className="text-sm font-medium">Depuis 2018</span>
            </div>
          </div>

          {/* Contact Quick Info */}
          <div className="space-y-6 animate-fade-in-up stagger-2">
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <Phone className="h-5 w-5 text-yellow-400" />
                </div>
                <button
                  onClick={handlePhoneClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-lg"
                >
                  {restaurantData?.contact?.phone || "05 46 66 46 31"}
                </button>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mt-1">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <span className="text-gray-300 leading-relaxed">
                    {restaurantData?.contact?.address || "12 Quai Nicolas Baudin, 17410 Saint Martin de Ré"}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">Saint Martin de Ré, Île de Ré</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6 animate-fade-in-up stagger-3">
            <h4 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 text-yellow-400 mr-2" />
              Horaires
            </h4>
            <div className="space-y-3">
              {restaurantData?.contact?.hours ? (
                Object.entries(restaurantData.contact.hours).map(([day, hours]) => {
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
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-300 font-medium">{dayNames[day]}</span>
                      <span className={`${isClosed ? 'text-red-400' : 'text-gray-400'}`}>
                        {hours}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mardi</span>
                    <span className="text-gray-400">12h15-13h30, 19h15-21h15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mercredi</span>
                    <span className="text-gray-400">12h15-13h30, 19h15-21h15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Jeudi</span>
                    <span className="text-gray-400">12h15-13h30, 19h15-21h15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Vendredi</span>
                    <span className="text-gray-400">12h15-13h30, 19h15-21h15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Samedi</span>
                    <span className="text-gray-400">12h15-13h30, 19h15-21h15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dimanche</span>
                    <span className="text-gray-400">12h15-13h30, 19h15-21h15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lundi</span>
                    <span className="text-red-400">Fermé</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} Les Embruns. Tous droits réservés.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Fait avec</span>
                <Heart className="h-4 w-4 text-red-400 fill-current animate-pulse" />
                <span>par Tom</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Restaurant Semi-Gastronomique</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Île de Ré</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center animate-fade-in-up stagger-4">
          <button
            onClick={handlePhoneClick}
            className="btn-primary bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Réserver une Table
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;