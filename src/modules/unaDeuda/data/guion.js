// Guion "Una deuda" de Rodolfo Soto. Sin acotaciones entre paréntesis ni narración inicial.
const RAW = [
  ['ella', 'Ey…'],
  ['el', 'Eres…'],
  ['ella', 'Sí…'],
  ['el', 'Estás embarazada…'],
  ['ella', 'Vaya, veo que lo notaste.'],
  ['el', 'Perdón, no quería ofenderte.'],
  ['ella', 'No te preocupes, es lo más gentil que me han dicho hoy.'],
  ['el', 'Todavía me sucede… De la nada siento unas inexplicables ganas de llorar.'],
  ['ella', '¿De la nada? La “nada” siempre tiene nombre… y rostro.'],
  ['el', 'No, mi “nada” dejó de tener nombre hace mucho tiempo.'],
  ['ella', '¿Hace cuánto tiempo?'],
  ['el', 'Como tres años después de que te fueras.'],
  ['ella', '¿No quieres saber porqué estoy en este pueblo donde no pasa nada?'],
  ['el', 'No. Hace mucho tiempo dejé de desear saber en dónde estabas y qué hacías.'],
  ['el', 'Vete de aquí y deja este pueblo con su nopasanada.'],
  ['el', 'Aquí todos aprendimos a estar bien sin ti, a disimular las manchas, recuperamos la fe sepa Dios cómo. Vete. Por favor.'],
  ['ella', 'Solo venía a decirte “adios”, te lo debía, me lo debía.'],
]

// Todas las líneas en orden, con id estable (ud-01, ud-02, ...).
export const LINES = RAW.map(([personaje, texto], i) => ({
  id: `ud-${String(i + 1).padStart(2, '0')}`,
  orden: i + 1,
  personaje,
  texto,
}))

const byId = new Map(LINES.map((l) => [l.id, l]))

// Devuelve la línea previa (de "Ella" o de "Él") o null si es la primera.
export function getPrevious(id) {
  const line = byId.get(id)
  if (!line || line.orden <= 1) return null
  return LINES[line.orden - 2]
}

// Solo las líneas de "Él", usadas como `module.words`.
// `en` = texto de la línea, `es` = texto de la línea previa (contexto).
export const EL_LINES = LINES.filter((l) => l.personaje === 'el').map((l) => ({
  ...l,
  en: l.texto,
  es: getPrevious(l.id)?.texto ?? '',
}))
