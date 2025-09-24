import React, { useState, useEffect } from 'react';
import { restaurantApi } from '../services/api';
import { SectionLoader } from './LoadingSpinner';

const MenuSection = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await restaurantApi.getMenu();
        setMenuData(data);
      } catch (err) {
        setError('Erreur lors du chargement du menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <SectionLoader message="Chargement de notre carte..." />
      </section>
    );
  }

  if (error || !menuData.length) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Carte</h2>
          <p className="text-gray-600">Menu temporairement indisponible</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-l from-yellow-200/25 to-transparent rounded-full blur-3xl animate-float stagger-2"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-r from-yellow-300/20 to-transparent rounded-full blur-3xl animate-float stagger-4"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Notre Carte
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto mb-8"></div>
          </div>
          <div className="animate-fade-in-up stagger-2">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Découvrez une cuisine qui célèbre les saveurs de l'île de Ré et les produits de la mer
            </p>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-20">
          {menuData.map((category, categoryIndex) => (
            <div key={category.id || category.name} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
              {/* Category Title */}
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {category.name}
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto"></div>
              </div>
              {/* Menu Items Grid */}
              <div
                className={`grid gap-8 ${
                  category.items.length === 1
                    ? 'grid-cols-1 place-items-center' // 1 colonne et centre horizontal/vertical
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={`${item.name}-${itemIndex}`}
                    className="card-white hover:shadow-2xl transition-all duration-400 group animate-scale-in w-full md:max-w-xl"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (itemIndex * 0.1)}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-black transition-colors duration-300">
                        {item.name}
                      </h4>
                      <div className="ml-6 flex-shrink-0">
                        <span className="text-xl md:text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                          {item.price}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {item.description}
                    </p>
                    
                    {/* Decorative line */}
                    <div className="mt-4 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
