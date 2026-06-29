import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import favoritoService from '../services/favoritoService';
import { useAuth } from './AuthProvider';

interface FavoritosContextType {
  favoritos: any[]; // productos poblados (para "Mis Favoritos")
  esFavorito: (id: string) => boolean;
  toggleFavorito: (producto: any) => Promise<void>;
  loading: boolean;
  recargar: () => Promise<void>;
  total: number;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const useFavoritos = (): FavoritosContextType => {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error('useFavoritos must be used within a FavoritosProvider');
  return ctx;
};

export const FavoritosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Carga los favoritos del usuario (o limpia si no hay sesión)
  const cargar = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set());
      setFavoritos([]);
      return;
    }
    try {
      setLoading(true);
      const data = await favoritoService.getAll();
      const lista = Array.isArray(data) ? data : [];
      setFavoritos(lista);
      setIds(new Set(lista.map((p: any) => p._id)));
    } catch {
      // Silencioso: si falla (p. ej. sesión expirada), lista vacía
      setFavoritos([]);
      setIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const esFavorito = useCallback((id: string) => ids.has(id), [ids]);

  // Alterna favorito con actualización optimista; si la API falla, recarga.
  const toggleFavorito = useCallback(
    async (producto: any) => {
      const id = typeof producto === 'string' ? producto : producto?._id;
      if (!id) return;
      const yaEsFavorito = ids.has(id);

      setIds((prev) => {
        const next = new Set(prev);
        if (yaEsFavorito) next.delete(id);
        else next.add(id);
        return next;
      });
      setFavoritos((prev) => {
        if (yaEsFavorito) return prev.filter((p) => p._id !== id);
        return typeof producto === 'object' ? [producto, ...prev] : prev;
      });

      try {
        if (yaEsFavorito) await favoritoService.remove(id);
        else await favoritoService.add(id);
      } catch {
        cargar(); // revertir al estado del servidor
      }
    },
    [ids, cargar]
  );

  return (
    <FavoritosContext.Provider
      value={{ favoritos, esFavorito, toggleFavorito, loading, recargar: cargar, total: ids.size }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export default FavoritosContext;
