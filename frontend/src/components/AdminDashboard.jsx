import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Menu, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Lock, 
  Unlock,
  LogOut,
  Home
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ sessionId, onLogout }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [menuData, setMenuData] = useState([]);
  const [siteSettings, setSiteSettings] = useState({ is_locked: true });
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // will hold "categoryId-itemIndex"
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
  const [showAddItem, setShowAddItem] = useState(null);

  // Axios instance with auth header
  const authAxios = axios.create({
    baseURL: API,
    headers: {
      'Authorization': `Bearer ${sessionId}`
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuResponse, settingsResponse] = await Promise.all([
        authAxios.get('/admin/menu'),
        axios.get(`${API}/site/settings`)
      ]);
      
      setMenuData(menuResponse.data);
      setSiteSettings(settingsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSiteLock = async () => {
    try {
      const newSettings = { is_locked: !siteSettings.is_locked };
      await authAxios.put('/admin/site/settings', newSettings);
      setSiteSettings(newSettings);
    } catch (error) {
      console.error('Error updating site settings:', error);
    }
  };

  const saveCategory = async (categoryId, updatedCategory) => {
    try {
      await authAxios.put(`/admin/menu/${categoryId}`, updatedCategory);
      await loadData();
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const addMenuItem = async (categoryId) => {
    if (!newItem.name || !newItem.description || !newItem.price) return;
    
    try {
      await authAxios.post(`/admin/menu/${categoryId}/items`, newItem);
      await loadData();
      setNewItem({ name: '', description: '', price: '' });
      setShowAddItem(null);
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const deleteMenuItem = async (categoryId, itemIndex) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;
    
    try {
      // use real item id when present, fallback to index
      const category = menuData.find(c => c.id === categoryId);
      const item = category?.items?.[itemIndex];
      const itemId = item?.id ?? itemIndex;

      await authAxios.delete(`/admin/menu/${categoryId}/items/${itemId}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  // --- New: item editing handlers ---
  const startEditItem = (categoryId, categoryIndex, itemIndex) => {
    // ensure the latest data is used locally
    setEditingItem(`${categoryId}-${itemIndex}`);
  };

  const handleItemChange = (categoryIndex, itemIndex, field, value) => {
    const updated = [...menuData];
    const item = { ...updated[categoryIndex].items[itemIndex], [field]: value };
    updated[categoryIndex].items[itemIndex] = item;
    setMenuData(updated);
  };

  const saveMenuItem = async (categoryId, itemIndex, item) => {
    try {
      const itemId = item?.id;

      if (itemId) {
        // endpoint item-specific (id présent)
        await authAxios.patch(`/admin/menu/${categoryId}/items/${itemId}`, {
          name: item.name,
          description: item.description,
          price: item.price
        });
      } else {
        // fallback : envoyer la catégorie entière via PUT si les items n'ont pas d'id
        const category = menuData.find(c => c.id === categoryId);
        if (!category) {
          throw new Error('Catégorie introuvable');
        }
        const updatedCategory = {
          ...category,
          items: category.items.map((it, idx) =>
            idx === itemIndex ? { ...it, name: item.name, description: item.description, price: item.price } : it
          )
        };
        await authAxios.put(`/admin/menu/${categoryId}`, updatedCategory);
      }

      await loadData();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Erreur lors de la sauvegarde : ' + (error.response?.data?.message || error.message));
    }
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    loadData();
  };
  // --- end new handlers ---

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    onLogout();
  };

  const goHome = () => {
    window.open('/', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-serif)' }}>
                Administration - Les Embruns
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={goHome}
                className="flex items-center px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                Voir le site
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-stone-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Paramètres
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                <Menu className="h-4 w-4 inline mr-2" />
                Gestion du Menu
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-stone-900 mb-6">Paramètres du Site</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium text-stone-900">
                    Verrouillage du Site
                  </h3>
                  <p className="text-stone-600">
                    {siteSettings.is_locked 
                      ? 'Le site nécessite un code d\'accès (2108) pour être consulté'
                      : 'Le site est accessible directement sans code d\'accès'
                    }
                  </p>
                </div>
                
                <button
                  onClick={toggleSiteLock}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    siteSettings.is_locked
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {siteSettings.is_locked ? (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Site Verrouillé
                    </>
                  ) : (
                    <>
                      <Unlock className="h-5 w-5 mr-2" />
                      Site Libre
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {menuData.map((category, categoryIndex) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-stone-900">
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => {
                          const updated = [...menuData];
                          updated[categoryIndex].name = e.target.value;
                          setMenuData(updated);
                        }}
                        className="text-2xl font-semibold bg-transparent border-b-2 border-amber-500 focus:outline-none"
                      />
                    ) : (
                      category.name
                    )}
                  </h2>
                  
                  <div className="flex space-x-2">
                    {editingCategory === category.id ? (
                      <>
                        <button
                          onClick={() => saveCategory(category.id, category)}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            loadData();
                          }}
                          className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingCategory(category.id)}
                        className="flex items-center px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => {
                    const editKey = `${category.id}-${itemIndex}`;
                    return (
                      <div key={itemIndex} className="flex justify-between items-start p-4 bg-stone-50 rounded-lg">
                        <div className="flex-1">
                          {editingItem === editKey ? (
                            <>
                              <div className="flex justify-between items-start mb-2">
                                <input
                                  type="text"
                                  value={menuData[categoryIndex].items[itemIndex].name}
                                  onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'name', e.target.value)}
                                  className="text-lg font-medium bg-white border border-stone-300 rounded px-2 py-1 w-2/3"
                                />
                                <span className="text-lg font-bold text-stone-900 ml-4">{menuData[categoryIndex].items[itemIndex].price}</span>
                              </div>
                              <textarea
                                value={menuData[categoryIndex].items[itemIndex].description}
                                onChange={(e) => handleItemChange(categoryIndex, itemIndex, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 mb-2"
                                rows="2"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => saveMenuItem(category.id, itemIndex, menuData[categoryIndex].items[itemIndex])}
                                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Sauvegarder
                                </button>
                                <button
                                  onClick={cancelEditItem}
                                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Annuler
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-medium text-stone-900">{item.name}</h4>
                                <span className="text-lg font-bold text-stone-900 ml-4">{item.price}</span>
                              </div>
                              <p className="text-stone-600">{item.description}</p>
                            </>
                          )}
                        </div>
                        
                        <div className="ml-4 flex flex-col space-y-2">
                          {editingItem === editKey ? null : (
                            <button
                              onClick={() => startEditItem(category.id, categoryIndex, itemIndex)}
                              className="p-2 text-amber-600 hover:bg-amber-100 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteMenuItem(category.id, itemIndex)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add new item */}
                  {showAddItem === category.id ? (
                    <div className="p-4 bg-amber-50 rounded-lg border-2 border-dashed border-amber-300">
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nom du plat"
                          value={newItem.name}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <textarea
                          placeholder="Description"
                          value={newItem.description}
                          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          rows="2"
                        />
                        <input
                          type="text"
                          placeholder="Prix (ex: 25€)"
                          value={newItem.price}
                          onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => addMenuItem(category.id)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Ajouter
                          </button>
                          <button
                            onClick={() => {
                              setShowAddItem(null);
                              setNewItem({ name: '', description: '', price: '' });
                            }}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddItem(category.id)}
                      className="w-full p-4 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-amber-400 hover:text-amber-600 transition-colors duration-200"
                    >
                      <Plus className="h-5 w-5 inline mr-2" />
                      Ajouter un plat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;