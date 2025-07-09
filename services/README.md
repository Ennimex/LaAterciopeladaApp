# Servicios de Administración - Documentación

## Introducción

Este sistema de servicios está diseñado para centralizar y simplificar las operaciones de API en el área administrativa de la aplicación. Incluye manejo automático de notificaciones, validaciones y estados de carga.

## Estructura de Servicios

### 1. Servicio Principal (adminServices.js)

El servicio principal incluye todas las operaciones CRUD para todos los módulos y manejo centralizado de notificaciones.

```javascript
import adminService from '../services/adminServices.js';

// Usar con notificaciones automáticas
const categorias = await adminService.getCategorias();
const nuevaCategoria = await adminService.createCategoria(formData);
```

### 2. Servicios Específicos

Cada módulo tiene su propio servicio con funcionalidades específicas:

- `categoriaService.js` - Gestión de categorías
- `productService.js` - Gestión de productos  
- `tallaService.js` - Gestión de tallas
- `localidadService.js` - Gestión de localidades
- `eventoService.js` - Gestión de eventos
- `fotoService.js` - Gestión de fotos
- `videoService.js` - Gestión de videos
- `servicioService.js` - Gestión de servicios
- `nosotrosService.js` - Gestión de misión/visión
- `colaboradorService.js` - Gestión de colaboradores
- `profileService.js` - Gestión de perfil

```javascript
import { tallaService } from '../services';

// Operaciones básicas
const tallas = await tallaService.getAll();
const talla = await tallaService.getById(id);
const nuevaTalla = await tallaService.create(data);
const tallaActualizada = await tallaService.update(id, data);
await tallaService.delete(id);

// Validación
const validation = tallaService.validate(tallaData);
if (validation.isValid) {
  // proceder
} else {
  console.log(validation.errors);
}

// Filtrado
const tallasFiltradas = tallaService.filter(tallas, {
  search: 'búsqueda',
  genero: 'Unisex',
  categoria: 'categoriaId'
});
```

## Hooks Personalizados

### useAdminNotifications

Hook para manejar notificaciones automáticas del sistema.

```javascript
import { useAdminNotifications } from '../services/adminHooks';

const MiComponente = () => {
  const { notifications, removeNotification, clearAllNotifications } = useAdminNotifications();

  return (
    <div>
      {/* Tu contenido */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};
```

### useAdminService

Hook para operaciones con estados de carga.

```javascript
import { useAdminService } from '../services/adminHooks';

const MiComponente = () => {
  const { loading, error, executeWithLoading } = useAdminService();

  const handleCreate = async () => {
    try {
      await executeWithLoading(() => adminService.createCategoria(data));
      // Éxito - notificación automática
    } catch (error) {
      // Error manejado automáticamente
    }
  };

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};
```

### useCrudOperations

Hook para operaciones CRUD completas.

```javascript
import { useCrudOperations } from '../services/adminHooks';

const GestionTallas = () => {
  const {
    data: tallas,
    loading,
    error,
    loadData,
    createItem,
    updateItem,
    deleteItem
  } = useCrudOperations('tallas');

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (tallaData) => {
    try {
      await createItem(tallaData);
      // Item agregado automáticamente al estado
    } catch (error) {
      // Error manejado
    }
  };

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      {tallas.map(talla => (
        <div key={talla._id}>{talla.nombre}</div>
      ))}
    </div>
  );
};
```

## Componente de Notificaciones

### NotificationContainer

Componente para mostrar notificaciones del sistema.

```javascript
import NotificationContainer from '../components/admin/NotificationContainer';

// Se usa junto con useAdminNotifications
<NotificationContainer
  notifications={notifications}
  onRemoveNotification={removeNotification}
  onClearAll={clearAllNotifications}
/>
```

## Tipos de Notificación

El sistema soporta diferentes tipos de notificaciones:

- `success` - Operaciones exitosas (verde)
- `error` - Errores (rojo)
- `warning` - Advertencias (amarillo)
- `info` - Información (azul)

```javascript
// Las notificaciones se emiten automáticamente, pero también puedes emitir manualmente:
adminService.emitNotification({
  type: 'success',
  title: 'Éxito',
  message: 'Operación completada',
  duration: 3000 // milisegundos (opcional)
});
```

## Validaciones

Cada servicio incluye métodos de validación:

```javascript
// Ejemplo con productos
const validation = productService.validate(productoData);
if (!validation.isValid) {
  console.log('Errores:', validation.errors);
  return;
}

// Ejemplo con archivos
const fileValidation = fotoService.validateImage(file);
if (!fileValidation.isValid) {
  console.log('Errores de archivo:', fileValidation.errors);
  return;
}
```

## Ejemplo Completo de Implementación

```javascript
import React, { useState, useEffect } from 'react';
import { categoriaService } from '../services';
import { useAdminNotifications } from '../services/adminHooks';
import NotificationContainer from '../components/admin/NotificationContainer';

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { notifications, removeNotification, clearAllNotifications } = useAdminNotifications();

  // Cargar datos
  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError(err.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear categoría
  const handleCreate = async (categoriaData, file) => {
    // Validar
    const validation = categoriaService.validate(categoriaData, file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      const formData = categoriaService.createFormData(categoriaData, file);
      const nuevaCategoria = await categoriaService.create(formData);
      setCategorias(prev => [...prev, nuevaCategoria]);
      setError(null);
    } catch (err) {
      setError(err.error || err.message);
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar categoría?')) return;

    try {
      await categoriaService.delete(id);
      setCategorias(prev => prev.filter(cat => cat._id !== id));
      setError(null);
    } catch (err) {
      setError(err.error || err.message);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div style={{color: 'red'}}>Error: {error}</div>}
      
      {/* Tu interfaz aquí */}
      
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default GestionCategorias;
```

## Migración de Código Existente

Para migrar código existente:

1. Reemplazar `adminAPI.getTallas()` por `tallaService.getAll()`
2. Reemplazar `adminAPI.createTalla()` por `tallaService.create()`
3. Agregar validaciones con `tallaService.validate()`
4. Agregar hook de notificaciones `useAdminNotifications()`
5. Agregar componente `<NotificationContainer />`
6. Usar filtros del servicio en lugar de lógica manual

## Beneficios

- ✅ Notificaciones automáticas para todas las operaciones
- ✅ Validaciones centralizadas y reutilizables  
- ✅ Manejo consistente de errores
- ✅ Código más limpio y mantenible
- ✅ Funciones de utilidad (filtros, formateo, etc.)
- ✅ Hooks personalizados para operaciones comunes
- ✅ TypeScript-ready (fácil agregar tipos)
- ✅ Fácil testing y debugging
