import api from './api.js';

// Define types
interface Localidad {
  id?: number;
  nombre: string;
  descripcion: string;
  [key: string]: any; // For additional dynamic properties
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Servicio específico para localidades
export const localidadService = {
  // Obtener todas las localidades
  getAll: async (): Promise<Localidad[]> => {
    try {
      const response = await api.get('/localidades');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener localidad por ID
  getById: async (id: number): Promise<Localidad> => {
    try {
      const response = await api.get(`/localidades/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva localidad
  create: async (localidadData: Localidad): Promise<Localidad> => {
    try {
      const response = await api.post('/localidades', localidadData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar localidad
  update: async (id: number, localidadData: Localidad): Promise<Localidad> => {
    try {
      const response = await api.put(`/localidades/${id}`, localidadData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar localidad
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/localidades/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de la localidad
  validate: (localidad: Localidad): ValidationResult => {
    const errors: string[] = [];

    if (!localidad.nombre || localidad.nombre.trim().length === 0) {
      errors.push('El nombre de la localidad es requerido');
    }

    if (localidad.nombre && localidad.nombre.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    if (!localidad.descripcion || localidad.descripcion.trim().length === 0) {
      errors.push('La descripción de la localidad es requerida');
    }

    if (localidad.descripcion && localidad.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Filtrar localidades
  filter: (localidades: Localidad[], searchTerm: string | null): Localidad[] => {
    if (!searchTerm) return localidades;

    const searchLower = searchTerm.toLowerCase();
    return localidades.filter(localidad => 
      localidad.nombre.toLowerCase().includes(searchLower) ||
      localidad.descripcion.toLowerCase().includes(searchLower)
    );
  }
};

export default localidadService;