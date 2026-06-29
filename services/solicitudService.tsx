import { api } from './api';

export interface SolicitudProductoInput {
  productoId?: string;
  _id?: string;
  nombre?: string;
  imagenURL?: string;
}

export interface SolicitudPayload {
  productos: SolicitudProductoInput[];
  mensaje?: string;
}

// Solicitudes de cotización. Requiere sesión; el token se adjunta solo.
const solicitudService = {
  getAll: (): Promise<any> => api.get('/solicitudes'),
  create: (payload: SolicitudPayload): Promise<any> => api.post('/solicitudes', payload),
};

export default solicitudService;
