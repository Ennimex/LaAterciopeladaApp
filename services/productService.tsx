import api from './api.js';

// Define types
interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  localidadId: number;
  tipoTela: string;
  tallasDisponibles: string[];
  [key: string]: any; // For additional dynamic properties
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

interface UploadProgressCallback {
  (progressEvent: AxiosProgressEvent): void;
}

interface Config {
  headers: {
    'Content-Type': string;
  };
  onUploadProgress?: UploadProgressCallback;
}

// Servicio específico para productos
export const productService = {
  // Obtener todos los productos
  getAll: async (): Promise<Producto[]> => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener producto por ID
  getById: async (id: number): Promise<Producto> => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo producto
  create: async (
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Producto> => {
    try {
      const config: Config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }

      const response = await api.post('/productos', formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar producto
  update: async (
    id: number,
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Producto> => {
    try {
      const config: AxiosRequestConfig<FormData> = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }

      const response = await api.put(`/productos/${id}`, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar producto
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos del producto
  validate: (producto: Producto): ValidationResult => {
    const errors: string[] = [];

    if (!producto.nombre || producto.nombre.trim().length === 0) {
      errors.push('El nombre del producto es requerido');
    }

    if (!producto.descripcion || producto.descripcion.trim().length === 0) {
      errors.push('La descripción del producto es requerida');
    }

    if (!producto.localidadId) {
      errors.push('La localidad es requerida');
    }

    if (!producto.tipoTela || producto.tipoTela.trim().length === 0) {
      errors.push('El tipo de tela es requerido');
    }

    if (!producto.tallasDisponibles || producto.tallasDisponibles.length === 0) {
      errors.push('Debe seleccionar al menos una talla');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Mantener compatibilidad con versiones anteriores
export const createProduct = async (productData: FormData): Promise<Producto> => {
  return productService.create(productData);
};

export const getProducts = async (): Promise<Producto[]> => {
  return productService.getAll();
};

export const deleteProduct = async (productId: number): Promise<void> => {
  return productService.delete(productId);
};

export default productService;