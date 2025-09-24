import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Chargement...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export const SectionLoader = ({ message = 'Chargement...' }) => {
  return (
    <div className="min-h-64 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-3"></div>
          <span className="text-gray-700 font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
      <div className="text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Les Embruns
          </h2>
          <p className="text-gray-600">Préparation de l'expérience...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;