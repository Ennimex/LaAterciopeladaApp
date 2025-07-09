import api from './api.js';

// Define types
interface Talla {
  id?: number;
  categoriaId: number;
  talla: string;
  genero: string;
  rangoEdad?: string;
  medida?: string;
  [key: string]: any; // For additional dynamic properties
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface FilterOptions {
  genero?: string;
  categoria?: number;
  search?: string;
  [key: string]: any; // For additional dynamic filters
}

// Servicio específico para tallas
export const tallaService = {
  // Obtener todas las tallas
  getAll: async (): Promise<Talla[]> => {
    try {
      const response = await api.get('/tallas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener talla por ID
  getById: async (id: number): Promise<Talla> => {
    try {
      const response = await api.get(`/tallas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva talla
  create: async (tallaData: Talla): Promise<Talla> => {
    try {
      const response = await api.post('/tallas', tallaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar talla
  update: async (id: number, tallaData: Talla): Promise<Talla> => {
    try {
      const response = await api.put(`/tallas/${id}`, tallaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar talla
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tallas/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener tallas por categoría
  getByCategoria: async (categoriaId: number): Promise<Talla[]> => {
    try {
      const response = await api.get('/tallas');
      return response.data.filter((talla: Talla) => talla.categoriaId === categoriaId);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de la talla
  validate: (talla: Talla): ValidationResult => {
    const errors: string[] = [];
    const generosValidos = ['Unisex', 'Niño', 'Niña', 'Dama', 'Caballero'];

    if (!talla.categoriaId) {
      errors.push('La categoría es requerida');
    }

    if (!talla.talla || talla.talla.trim().length === 0) {
      errors.push('La talla es requerida');
    }

    if (talla.talla && talla.talla.length > 20) {
      errors.push('La talla no puede tener más de 20 caracteres');
    }

    if (!talla.genero) {
      errors.push('El género es requerido');
    }

    if (talla.genero && !generosValidos.includes(talla.genero)) {
      errors.push('El género debe ser uno de los valores válidos');
    }

    if (talla.rangoEdad && talla.rangoEdad.length > 30) {
      errors.push('El rango de edad no puede tener más de 30 caracteres');
    }

    if (talla.medida && talla.medida.length > 30) {
      errors.push('La medida no puede tener más de 30 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Filtrar tallas
  filter: (tallas: Talla[], filters: FilterOptions): Talla[] => {
    return tallas.filter(talla => {
      let matches = true;

      if (filters.genero && talla.genero !== filters.genero) {
        matches = false;
      }

      if (filters.categoria && talla.categoriaId !== filters.categoria) {
        matches = false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchFields = [
          talla.talla,
          talla.genero,
          talla.rangoEdad,
          talla.medida
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchFields.includes(searchLower)) {
          matches = false;
        }
      }

      return matches;
    });
  }
};

export default tallaService;