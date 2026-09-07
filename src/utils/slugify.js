// Genera un id estable a partir de un texto (palabra en inglés), para usarlo
// como clave de progreso independiente del orden de la lista.
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
