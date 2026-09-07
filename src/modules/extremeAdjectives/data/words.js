// Lista de "extreme adjectives" (adjetivos extremos/no graduables) en inglés
// con su traducción al español y una definición corta en inglés (usada por
// el examen "solo en inglés": palabra <-> definición).
//
// Un extreme adjective ya expresa el grado máximo de una cualidad (p. ej.
// "huge" = "very big"), así que en inglés no se intensifica con "very" sino
// con "absolutely" / "completely" / "totally". Es una lista cerrada y
// específica (a diferencia de los adjetivos "normales", que son una clase
// abierta), así que -igual que en linking verbs e irregular verbs- no hace
// falta una heurística de "parece adjetivo extremo": basta con la lista de
// palabras.
//
// Algunas entradas tienen dos sinónimos habituales (huge/enormous,
// stunning/breathtaking, starving/famished); `en` muestra ambos en la
// flashcard tal cual, y `forms` declara cada palabra por separado para que
// el modo Identificar reconozca cualquiera de las dos en un texto libre.
import { slugify } from '../../../utils/slugify';

const RAW_EXTREME_ADJECTIVES = [
  ['exhausted', 'agotado', 'Extremely tired, with no energy left at all.'],
  ['ancient', 'antiquísimo / ancestral', 'Extremely old, often from a very distant time in history.'],
  ['fascinating', 'fascinante', "Extremely interesting; capturing someone's full attention."],
  ['deafening', 'ensordecedor', 'Extremely loud, so loud it seems to block out all other sound.'],
  ['filthy', 'extremadamente sucio / mugriento', 'Extremely dirty; covered in grime.'],
  ['hideous', 'horrendo / espantoso', 'Extremely ugly; shocking or unpleasant to look at.'],
  ['huge / enormous', 'enorme / gigantesco', 'Extremely large in size.', ['huge', 'enormous']],
  [
    'stunning / breathtaking',
    'impresionante / espectacular',
    'Extremely beautiful or impressive, to the point of astonishing you.',
    ['stunning', 'breathtaking'],
  ],
  ['thrilled', 'emocionadísimo / encantado', 'Extremely happy and excited about something.'],
  ['hilarious', 'graciosísimo / muy divertido', 'Extremely funny; causing a lot of laughter.'],
  ['immaculate', 'impecable', 'Extremely clean and perfectly tidy, without a single flaw.'],
  ['amazed', 'asombrado / maravillado', 'Extremely surprised; filled with wonder.'],
  ['delighted', 'encantado / muy feliz', 'Extremely pleased and happy about something.'],
  ['furious', 'furioso', 'Extremely angry.'],
  ['positive', 'positivo / completamente seguro', 'Completely certain about something, with no doubt at all.'],
  ['tiny', 'diminuto', 'Extremely small in size.'],
  ['terrifying', 'aterrador', 'Extremely frightening; causing intense fear.'],
  ['freezing', 'helado / muy frío', 'Extremely cold.'],
  ['brilliant', 'brillante / genial', 'Extremely clever, skillful, or impressive.'],
  ['bizarre', 'extremadamente extraño / rarísimo', 'Extremely strange or unusual.'],
  ['boiling', 'hirviendo / muy caliente', 'Extremely hot.'],
  [
    'starving / famished',
    'muerto de hambre / hambriento',
    'Extremely hungry.',
    ['starving', 'famished'],
  ],
];

export const words = RAW_EXTREME_ADJECTIVES.map(([en, es, enDef, forms]) => ({
  id: slugify(en),
  en,
  es,
  enDef,
  ...(forms ? { forms } : {}),
}));
