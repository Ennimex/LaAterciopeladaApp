import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import api from './api.js';

// Define types
interface Video {
  id?: number;
  titulo: string;
  descripcion?: string;
  duracion?: number;
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
type Config = AxiosRequestConfig<FormData>;

// Video service implementation
export const videoService = {
  // Get all videos
  getAll: async (): Promise<Video[]> => {
    try {
      const response = await api.get('/videos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get video by ID
  getById: async (id: number): Promise<Video> => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new video
  create: async (
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Video> => {
    try {
      const config: Config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000 // 10 minutes for large videos
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post('/videos', formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update video
  update: async (
    id: number,
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Video> => {
    try {
      const config: Config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000 // 10 minutes for large videos
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.put(`/videos/${id}`, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete video
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/videos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validate video file
  validateVideo: (file: FileWithType | null): ValidationResult => {
    const errors: string[] = [];
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!file) {
      errors.push('Debe seleccionar un video');
      return { isValid: false, errors };
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de video (MP4, AVI, MOV, WMV, WebM)');
    }

    if (file.size > maxSize) {
      errors.push('El archivo no puede ser mayor a 100MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate video data
  validate: (video: Video, file: FileWithType | null = null): ValidationResult => {
    const errors: string[] = [];

    if (!video.titulo || video.titulo.trim().length === 0) {
      errors.push('El título del video es requerido');
    }

    if (video.titulo && video.titulo.length > 100) {
      errors.push('El título no puede tener más de 100 caracteres');
    }

    if (video.descripcion && video.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    if (file) {
      const videoValidation = videoService.validateVideo(file);
      if (!videoValidation.isValid) {
        errors.push(...videoValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Create FormData for video upload
  createFormData: (videoData: Video, file: FileWithType | null): FormData => {
    const formData = new FormData();
    formData.append('titulo', videoData.titulo);
    
    if (videoData.descripcion) {
      formData.append('descripcion', videoData.descripcion);
    }
    
    if (file) {
      formData.append('video', file);
    }

    return formData;
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  },

  // Format video duration
  formatDuration: (seconds: number | undefined): string => {
    if (!seconds) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // Filter videos
  filter: (videos: Video[], searchTerm: string | null): Video[] => {
    if (!searchTerm) return videos;

    const searchLower = searchTerm.toLowerCase();
    return videos.filter(video => 
      video.titulo.toLowerCase().includes(searchLower) ||
      (video.descripcion && video.descripcion.toLowerCase().includes(searchLower))
    );
  },

  // Sort videos
  sort: (
    videos: Video[],
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ): Video[] => {
    return [...videos].sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case 'createdAt':
          valueA = new Date(a.createdAt || (a as any)._id);
          valueB = new Date(b.createdAt || (b as any)._id);
          break;
        case 'titulo':
          valueA = a.titulo.toLowerCase();
          valueB = b.titulo.toLowerCase();
          break;
        case 'duracion':
          valueA = a.duracion || 0;
          valueB = b.duracion || 0;
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  }
};

export default videoService;