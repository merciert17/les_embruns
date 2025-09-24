import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Settings } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Veuillez entrer le mot de passe admin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/login`, {
        password: password.trim()
      });

      if (response.data.success) {
        localStorage.setItem('admin_session', response.data.session_id);
        onLoginSuccess(response.data.session_id);
      } else {
        setError(response.data.message);
        setPassword('');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-gray-800 to-stone-900 px-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Settings className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Administration
            </h1>
            <p className="text-gray-300 text-lg">
              Les Embruns - Panel Admin
            </p>
          </div>

          {/* Admin Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-200 mb-2">
                Mot de Passe Admin
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Entrez le mot de passe admin"
                  className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 text-lg text-center font-mono bg-white/20 text-white placeholder-gray-300"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 animate-shake">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Accéder à l\'Administration'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl animate-float-delayed"></div>
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

export default AdminLogin;