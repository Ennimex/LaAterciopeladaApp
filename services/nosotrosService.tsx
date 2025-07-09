import api from './api.js';

// Define types
interface Nosotros {
  id?: number;
  mision: string;
  vision: string;
  [key: string]: any; // For additional dynamic properties
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Servicio específico para nosotros (misión/visión)
export const nosotrosService = {
  // Obtener información de nosotros
  get: async (): Promise<Nosotros> => {
    try {
      const response = await api.get('/nosotros');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener información por ID
  getById: async (id: number): Promise<Nosotros> => {
    try {
      const response = await api.get(`/nosotros/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear o actualizar información de nosotros
  createOrUpdate: async (nosotrosData: Nosotros): Promise<Nosotros> => {
    try {
      const response = await api.post('/nosotros', nosotrosData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar información de nosotros por ID
  update: async (id: number, nosotrosData: Nosotros): Promise<Nosotros> => {
    try {
      const response = await api.put(`/nosotros/${id}`, nosotrosData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar información de nosotros
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/nosotros/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de nosotros
  validate: (nosotros: Nosotros): ValidationResult => {
    const errors: string[] = [];

    if (!nosotros.mision || nosotros.mision.trim().length === 0) {
      errors.push('La misión es requerida');
    }

    if (nosotros.mision && nosotros.mision.length > 2000) {
      errors.push('La misión no puede tener más de 2000 caracteres');
    }

    if (!nosotros.vision || nosotros.vision.trim().length === 0) {
      errors.push('La visión es requerida');
    }

    if (nosotros.vision && nosotros.vision.length > 2000) {
      errors.push('La visión no puede tener más de 2000 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Contar caracteres para UI
  getCharacterCount: (text: string | null | undefined): number => {
    return text ? text.length : 0;
  },

  // Verificar si hay cambios
  hasChanges: (original: Nosotros | null, current: Nosotros): boolean => {
    if (!original) return true;
    
    return (
      original.mision !== current.mision ||
      original.vision !== current.vision
    );
  }
};

export default nosotrosService;