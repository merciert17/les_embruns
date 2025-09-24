import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://10.64.137.82:8001";
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const restaurantApi = {
  // Get restaurant information
  getRestaurantInfo: async () => {
    try {
      const response = await apiClient.get('/restaurant/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      throw error;
    }
  },

  // Get menu data
  getMenu: async () => {
    try {
      const response = await apiClient.get('/menu');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  },

  // Get gallery images
  getGallery: async () => {
    try {
      const response = await apiClient.get('/gallery');
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery:', error);
      throw error;
    }
  },

  // Verify access code
  verifyAccess: async (code) => {
    try {
      const response = await apiClient.post('/access/verify', { code });
      return response.data;
    } catch (error) {
      console.error('Error verifying access:', error);
      throw error;
    }
  },

  // Check session validity
  checkSession: async (sessionId) => {
    try {
      const response = await apiClient.get(`/access/check/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking session:', error);
      throw error;
    }
  },

  // Get site settings
  getSiteSettings: async () => {
    try {
      const response = await apiClient.get('/site/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (password) => {
    try {
      const response = await apiClient.post('/admin/login', { password });
      return response.data;
    } catch (error) {
      console.error('Error in admin login:', error);
      throw error;
    }
  },

  // Check admin session
  checkAdminSession: async (sessionId) => {
    try {
      const response = await apiClient.get(`/admin/check/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking admin session:', error);
      throw error;
    }
  },

  // Update site settings (admin)
  updateSiteSettings: async (sessionId, settings) => {
    try {
      const response = await apiClient.put('/admin/site/settings', settings, {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating site settings:', error);
      throw error;
    }
  },

  // Get admin menu
  getAdminMenu: async (sessionId) => {
    try {
      const response = await apiClient.get('/admin/menu', {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin menu:', error);
      throw error;
    }
  },

  // Update menu category (admin)
  updateMenuCategory: async (sessionId, categoryId, category) => {
    try {
      const response = await apiClient.put(`/admin/menu/${categoryId}`, category, {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating menu category:', error);
      throw error;
    }
  },

  // Add menu item (admin)
  addMenuItem: async (sessionId, categoryId, item) => {
    try {
      const response = await apiClient.post(`/admin/menu/${categoryId}/items`, item, {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  // Delete menu item (admin)
  deleteMenuItem: async (sessionId, categoryId, itemIndex) => {
    try {
      const response = await apiClient.delete(`/admin/menu/${categoryId}/items/${itemIndex}`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error in health check:', error);
      throw error;
    }
  }
};

export default restaurantApi;