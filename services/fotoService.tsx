import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import api from './api.js';

// Define types
interface Foto {
  id?: number;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  createdAt?: string | Date;
  _id?: string; // For MongoDB compatibility
  [key: string]: any; // For additional dynamic properties
}

interface FileWithType extends File {
  type: string;
  size: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface UploadProgressCallback {
  (percentCompleted: number): void;
}

// Servicio específico para fotos
export const fotoService = {
  // Obtener todas las fotos
  getAll: async (): Promise<Foto[]> => {
    try {
      const response = await api.get('/fotos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener foto por ID
  getById: async (id: number): Promise<Foto> => {
    try {
      const response = await api.get(`/fotos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva foto
  create: async (
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Foto> => {
    try {
      const config: AxiosRequestConfig<FormData> = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post('/fotos', formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar foto existente
  update: async (
    id: number,
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Foto> => {
    try {
      const config: AxiosRequestConfig<FormData> = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.put(`/fotos/${id}`, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/fotos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar archivo de imagen
  validateImage: (file: FileWithType | null): ValidationResult => {
    const errors: string[] = [];
    
    if (!file) {
      errors.push('Debe seleccionar una imagen');
      return { isValid: false, errors };
    }

    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
    }

    // Verificar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('El archivo no puede ser mayor a 10MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validar datos de la foto
  validate: (foto: Foto, file: FileWithType | null = null): ValidationResult => {
    const errors: string[] = [];

    if (!foto.titulo || foto.titulo.trim().length === 0) {
      errors.push('El título de la foto es requerido');
    }

    if (foto.titulo && foto.titulo.length > 100) {
      errors.push('El título no puede tener más de 100 caracteres');
    }

    if (foto.descripcion && foto.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    // Validar archivo si se proporciona
    if (file) {
      const imageValidation = fotoService.validateImage(file);
      if (!imageValidation.isValid) {
        errors.push(...imageValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Crear FormData para subir foto
  createFormData: (fotoData: Foto, file: FileWithType | null): FormData => {
    const formData = new FormData();
    
    formData.append('titulo', fotoData.titulo);
    
    if (fotoData.descripcion) {
      formData.append('descripcion', fotoData.descripcion);
    }
    
    if (file) {
      formData.append('imagen', file);
    }

    return formData;
  },

  // Filtrar fotos
  filter: (fotos: Foto[], searchTerm: string | null): Foto[] => {
    if (!searchTerm) return fotos;

    const searchLower = searchTerm.toLowerCase();
    return fotos.filter(foto => 
      foto.titulo.toLowerCase().includes(searchLower) ||
      (foto.descripcion && foto.descripcion.toLowerCase().includes(searchLower))
    );
  },

  // Ordenar fotos
  sort: (
    fotos: Foto[],
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ): Foto[] => {
    return [...fotos].sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case 'createdAt':
          valueA = new Date(a.createdAt ?? a._id ?? 0);
          valueB = new Date(b.createdAt ?? b._id ?? 0);
          break;
        case 'titulo':
          valueA = a.titulo.toLowerCase();
          valueB = b.titulo.toLowerCase();
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }
};

export default fotoService;