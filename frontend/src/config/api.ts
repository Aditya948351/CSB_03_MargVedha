// API Configuration
// In production, direct requests to Render backend; in development, use the Vite dev proxy
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://csb-03-margvedha.onrender.com' 
  : '';
