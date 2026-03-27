import { api } from './api';

// Define types
interface ProfileData {
  name?: string;
  nombre?: string;
  email?: string;
  correo?: string;
  phone?: string;
  telefono?: string;
  [key: string]: any;
}

interface PasswordData {
  current?: string;
  currentPassword?: string;
  new?: string;
  newPassword?: string;
  confirm?: string;
  confirmPassword?: string;
  [key: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const profileService = {
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get('/perfil');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData: ProfileData): Promise<any> => {
    try {
      const response = await api.put('/perfil', {
        name: profileData.nombre || profileData.name,
        email: profileData.correo || profileData.email,
        phone: profileData.telefono || profileData.phone,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (passwordData: PasswordData): Promise<any> => {
    try {
      const response = await api.put('/perfil/password', {
        currentPassword: passwordData.current || passwordData.currentPassword,
        newPassword: passwordData.new || passwordData.newPassword,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  validateProfile: (profileData: ProfileData): ValidationResult => {
    const errors: string[] = [];
    const name = profileData.name || profileData.nombre;
    const email = profileData.email || profileData.correo;
    const phone = profileData.phone || profileData.telefono;

    if (!name) errors.push('El nombre es requerido');
    if (name && name.length < 2) errors.push('El nombre debe tener al menos 2 caracteres');
    if (name && name.length > 100) errors.push('El nombre no puede tener más de 100 caracteres');
    if (!email) errors.push('El email es requerido');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('El email debe tener un formato válido');
    if (phone && !/^[+]?[0-9\s\-()]{7,15}$/.test(phone)) errors.push('El teléfono debe tener un formato válido');

    return { isValid: errors.length === 0, errors };
  },

  validatePasswordChange: (passwordData: PasswordData): ValidationResult => {
    const errors: string[] = [];
    const currentPassword = passwordData.current || passwordData.currentPassword;
    const newPassword = passwordData.new || passwordData.newPassword;
    const confirmPassword = passwordData.confirm || passwordData.confirmPassword;

    if (!currentPassword) errors.push('La contraseña actual es requerida');
    if (!newPassword) errors.push('La nueva contraseña es requerida');
    if (newPassword && newPassword.length < 6) errors.push('La nueva contraseña debe tener al menos 6 caracteres');
    if (newPassword && newPassword.length > 50) errors.push('La nueva contraseña no puede tener más de 50 caracteres');
    if (confirmPassword && newPassword !== confirmPassword) errors.push('Las contraseñas no coinciden');
    if (currentPassword && newPassword && currentPassword === newPassword) errors.push('La nueva contraseña debe ser diferente a la actual');

    return { isValid: errors.length === 0, errors };
  },

  hasProfileChanges: (original: ProfileData | null, current: ProfileData): boolean => {
    if (!original) return true;
    return (
      (original.name || original.nombre) !== (current.name || current.nombre) ||
      (original.email || original.correo) !== (current.email || current.correo) ||
      (original.phone || original.telefono) !== (current.phone || current.telefono)
    );
  },
};

export default profileService;