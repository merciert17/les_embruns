import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { restaurantApi } from '../services/api';

const AccessGate = ({ onAccessGranted }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Check if user already has valid session
    const sessionId = localStorage.getItem('restaurant_session');
    if (sessionId) {
      checkExistingSession(sessionId);
    }
  }, []);

  const checkExistingSession = async (sessionId) => {
    try {
      const response = await restaurantApi.checkSession(sessionId);
      if (response.hasAccess) {
        onAccessGranted();
      } else {
        localStorage.removeItem('restaurant_session');
      }
    } catch (error) {
      localStorage.removeItem('restaurant_session');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Veuillez entrer le code d\'accès');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await restaurantApi.verifyAccess(code.trim());

      if (response.success) {
        localStorage.setItem('restaurant_session', response.session_id);
        onAccessGranted();
      } else {
        setError(response.message);
        setCode('');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to reasonable length
    if (/^\d*$/.test(value) && value.length <= 10) {
      setCode(value);
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 px-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Les Embruns
            </h1>
            <p className="text-stone-600 text-lg">
              Accès Privé
            </p>
          </div>

          {/* Access Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="access-code" className="block text-sm font-medium text-stone-700 mb-2">
                Code d'Accès
              </label>
              <div className="relative">
                <input
                  id="access-code"
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={handleInputChange}
                  placeholder="Entrez le code d'accès"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all duration-200 text-lg text-center font-mono bg-white/80"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="w-full bg-stone-800 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-stone-700 focus:ring-2 focus:ring-stone-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Vérification...
                </div>
              ) : (
                'Accéder au Restaurant'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-stone-500 text-sm">
              Restaurant Semi-Gastronomique
            </p>
            <p className="text-stone-400 text-xs mt-1">
              Saint Martin de Ré
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AccessGate;