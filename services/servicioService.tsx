import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import api from './api.js';

// Define types
interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio?: number | string;
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


// Service implementation
export const servicioService = {
  // Get all services
  getAll: async (): Promise<Servicio[]> => {
    try {
      const response = await api.get('/servicios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw error;
    }
  },

  // Get service by ID
  getById: async (id: number): Promise<Servicio> => {
    try {
      const response = await api.get(`/servicios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el servicio:', error);
      throw error;
    }
  },

  // Create new service
  create: async (
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Servicio> => {
    try {
      const config: AxiosRequestConfig<FormData> = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post('/servicios', formData, config);
      return response.data;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  },

  // Update service
  update: async (
    id: number,
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Servicio> => {
    try {
      const config: AxiosRequestConfig<FormData> = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.put(`/servicios/${id}`, formData, config);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  },

  // Validate image file
  validateImage: (file: FileWithType | null): ValidationResult => {
    const errors: string[] = [];
    
    if (!file) {
      errors.push('Debe seleccionar una imagen');
      return { isValid: false, errors };
    }

    // Verify file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
    }

    // Verify file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('El archivo no puede ser mayor a 10MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate service data
  validate: (servicio: Servicio, file: FileWithType | null = null): ValidationResult => {
    const errors: string[] = [];

    if (!servicio.nombre || servicio.nombre.trim().length === 0) {
      errors.push('El nombre del servicio es requerido');
    }

    if (servicio.nombre && servicio.nombre.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    if (!servicio.descripcion || servicio.descripcion.trim().length === 0) {
      errors.push('La descripción del servicio es requerida');
    }

    if (servicio.descripcion && servicio.descripcion.length > 1000) {
      errors.push('La descripción no puede tener más de 1000 caracteres');
    }

    if (servicio.precio && (isNaN(Number(servicio.precio)) || Number(servicio.precio) < 0)) {
      errors.push('El precio debe ser un número válido mayor o igual a 0');
    }

    // Validate file if provided
    if (file) {
      const imageValidation = servicioService.validateImage(file);
      if (!imageValidation.isValid) {
        errors.push(...imageValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Create FormData for service upload
  createFormData: (servicioData: Servicio, file: FileWithType | null): FormData => {
    const formData = new FormData();
    
    formData.append('nombre', servicioData.nombre);
    formData.append('descripcion', servicioData.descripcion);
    
    if (servicioData.precio) {
      formData.append('precio', String(servicioData.precio));
    }
    
    if (file) {
      formData.append('imagen', file);
    }

    return formData;
  },

  // Filter services
  filter: (servicios: Servicio[], searchTerm: string | null): Servicio[] => {
    if (!searchTerm) return servicios;

    const searchLower = searchTerm.toLowerCase();
    return servicios.filter(servicio => 
      servicio.nombre.toLowerCase().includes(searchLower) ||
      (servicio.descripcion && servicio.descripcion.toLowerCase().includes(searchLower))
    );
  },

  // Sort services
  sort: (
    servicios: Servicio[],
    sortBy: string = 'nombre',
    order: 'asc' | 'desc' = 'asc'
  ): Servicio[] => {
    return [...servicios].sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case 'nombre':
          valueA = a.nombre.toLowerCase();
          valueB = b.nombre.toLowerCase();
          break;
        case 'precio':
          valueA = parseFloat(String(a.precio)) || 0;
          valueB = parseFloat(String(b.precio)) || 0;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt || (a as any)._id);
          valueB = new Date(b.createdAt || (b as any)._id);
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

export default servicioService;