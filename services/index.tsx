// Archivo central que exporta todos los servicios móviles
export { default as categoriaService } from './categoriaService.js';
export { default as colaboradorService } from './colaboradorService.js';
export { default as eventoService } from './eventoService.js';
export { default as fotoService } from './fotoService.js';
export { default as localidadService } from './localidadService.js';
export { default as nosotrosService } from './nosotrosService.js';
export { default as productService } from './productService.js';
export { profileService } from './profileService.js';
export { servicioService } from './servicioService.js';
export { default as tallaService } from './tallaService.js';
export { default as videoService } from './videoService.js';

// API base (sin funciones admin)
export { default as api, authAPI, publicAPI } from './api.js';

