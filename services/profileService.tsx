import api from './api.js';

// Define types
interface ProfileData {
  name?: string;
  nombre?: string;
  email?: string;
  correo?: string;
  phone?: string;
  telefono?: string;
  [key: string]: any; // For additional dynamic properties
}

interface PasswordData {
  current?: string;
  currentPassword?: string;
  new?: string;
  newPassword?: string;
  confirm?: string;
  confirmPassword?: string;
  [key: string]: any; // For additional dynamic properties
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Profile service implementation
export const profileService = {
  // Get user profile
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/perfil');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile information
  updateProfile: async (profileData: ProfileData): Promise<any> => {
    try {
      const response = await api.put('/perfil', {
        name: profileData.nombre || profileData.name,
        email: profileData.correo || profileData.email,
        phone: profileData.telefono || profileData.phone
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update password
  updatePassword: async (passwordData: PasswordData): Promise<any> => {
    try {
      const response = await api.put('/perfil/password', {
        currentPassword: passwordData.current || passwordData.currentPassword,
        newPassword: passwordData.new || passwordData.newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate profile data
  validateProfile: (profileData: ProfileData): ValidationResult => {
    const errors: string[] = [];

    if (!profileData.name && !profileData.nombre) {
      errors.push('El nombre es requerido');
    }

    const name = profileData.name || profileData.nombre;
    if (name && name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (name && name.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    const email = profileData.email || profileData.correo;
    if (!email) {
      errors.push('El email es requerido');
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('El email debe tener un formato válido');
      }
    }

    const phone = profileData.phone || profileData.telefono;
    if (phone) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        errors.push('El teléfono debe tener un formato válido');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate password change
  validatePasswordChange: (passwordData: PasswordData): ValidationResult => {
    const errors: string[] = [];

    const currentPassword = passwordData.current || passwordData.currentPassword;
    const newPassword = passwordData.new || passwordData.newPassword;
    const confirmPassword = passwordData.confirm || passwordData.confirmPassword;

    if (!currentPassword) {
      errors.push('La contraseña actual es requerida');
    }

    if (!newPassword) {
      errors.push('La nueva contraseña es requerida');
    }

    if (newPassword && newPassword.length < 6) {
      errors.push('La nueva contraseña debe tener al menos 6 caracteres');
    }

    if (newPassword && newPassword.length > 50) {
      errors.push('La nueva contraseña no puede tener más de 50 caracteres');
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.push('La nueva contraseña debe ser diferente a la actual');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Check for profile changes
  hasProfileChanges: (original: ProfileData | null, current: ProfileData): boolean => {
    if (!original) return true;
    
    const originalName = original.name || original.nombre;
    const currentName = current.name || current.nombre;
    const originalEmail = original.email || original.correo;
    const currentEmail = current.email || current.correo;
    const originalPhone = original.phone || original.telefono;
    const currentPhone = current.phone || current.telefono;
    
    return (
      originalName !== currentName ||
      originalEmail !== currentEmail ||
      originalPhone !== currentPhone
    );
  },

  // Upload avatar (for future use)
  uploadAvatar: async (file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/perfil/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al subir el avatar');
    }
  },
};

export default profileService;