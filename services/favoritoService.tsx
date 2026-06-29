import { api } from './api';

// Favoritos (lista de deseos). Requiere sesión; el token se adjunta solo en el
// interceptor de api.tsx. El interceptor también devuelve directamente response.data.
const favoritoService = {
  getAll: (): Promise<any> => api.get('/favoritos'),
  add: (productoId: string): Promise<any> => api.post(`/favoritos/${productoId}`),
  remove: (productoId: string): Promise<any> => api.delete(`/favoritos/${productoId}`),
};

export default favoritoService;
