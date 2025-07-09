import api from './api.js';

// Define the Categoria type
interface Categoria {
  id?: number;
  nombre: string;
  descripcion: string;
  // Add any other properties that a categoria might have
}

// Define the service options type
interface CategoriaServiceOptions {
  search?: string;
  // Add any other filter options you might need
}

// Define the validate result type
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Servicio específico para categorías
export const categoriaService = {
  // Obtener todas las categorías
  getAll: async (): Promise<any> => {
    try {
      return await api.get('/categorias');
    } catch (error) {
      throw error;
    }
  },

  // Obtener categoría por ID
  getById: async (id: number): Promise<any> => {
    try {
      return await api.get(`/categorias/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva categoría
  create: async (
    formData: FormData, 
    onUploadProgress?: (progressEvent: import('axios').AxiosProgressEvent) => void
  ): Promise<any> => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      };

      return await api.post('/categorias', formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar categoría
  update: async (
    id: number, 
    formData: FormData, 
    onUploadProgress?: (progressEvent: import('axios').AxiosProgressEvent) => void
  ): Promise<any> => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      };

      return await api.put(`/categorias/${id}`, formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar categoría
  delete: async (id: number): Promise<any> => {
    try {
      return await api.delete(`/categorias/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de la categoría
  validate: (categoria: Categoria): ValidationResult => {
    const errors: string[] = [];

    if (!categoria.nombre || categoria.nombre.trim().length === 0) {
      errors.push('El nombre de la categoría es requerido');
    }

    if (categoria.nombre && categoria.nombre.length > 50) {
      errors.push('El nombre no puede tener más de 50 caracteres');
    }

    if (!categoria.descripcion || categoria.descripcion.trim().length === 0) {
      errors.push('La descripción de la categoría es requerida');
    }

    if (categoria.descripcion && categoria.descripcion.length > 200) {
      errors.push('La descripción no puede tener más de 200 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Filtrar categorías
  filter: (categorias: Categoria[], options: CategoriaServiceOptions = {}): Categoria[] => {
    if (!Array.isArray(categorias)) {
      return [];
    }

    let filtered = [...categorias];

    // Filtrar por búsqueda de texto
    if (options.search && options.search.trim()) {
      const searchTerm = options.search.toLowerCase().trim();
      filtered = filtered.filter(categoria => 
        categoria.nombre.toLowerCase().includes(searchTerm) ||
        (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm))
      );
    }

    // Ordenar por nombre por defecto
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return filtered;
  }
};

export default categoriaService;