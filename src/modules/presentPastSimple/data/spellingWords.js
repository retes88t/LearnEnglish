// Banco de verbos para practicar las reglas de ortografía de la 3ª persona
// singular (he/she/it) del presente simple afirmativo, según las láminas de
// referencia del feature:
//
// - `add-es`: el verbo termina en o, ch, sh, ss o x → se agrega "-es"
//   (go → goes, watch → watches, wash → washes, kiss → kisses, fix → fixes).
// - `y-to-ies`: el verbo termina en consonante + "y" → se cambia la "y" por
//   "ies" (study → studies, try → tries, fly → flies, cry → cries).
// - `add-s`: caso general (incluye vocal + "y", que NO cambia la "y") →
//   se agrega simplemente "-s" (play → plays, stay → stays). Se incluye
//   como contraste con `y-to-ies`, ya que ambos terminan en "y" pero se
//   comportan distinto según la letra previa.
//
// Cada tupla: [en (infinitivo), es (traducción breve), thirdPerson (forma
// correcta en 3ª persona singular)]. `go` y `do` son verbos irregulares (ver
// `src/modules/irregularVerbs/data/words.js`) reutilizados acá puntualmente
// porque son los ejemplos de referencia de la regla `-es`, no una
// duplicación de esa lista.
import { slugify } from '../../../utils/slugify';

const RULES = {
  'add-es': {
    ruleExplanation:
      'Termina en "o", "ch", "sh", "ss" o "x": se agrega "-es" en la 3ª persona singular.',
  },
  'y-to-ies': {
    ruleExplanation:
      'Termina en consonante + "y": se cambia la "y" por "ies" en la 3ª persona singular.',
  },
  'add-s': {
    ruleExplanation:
      'Termina en vocal + "y" (o no termina en "y"): se mantiene igual y se agrega "-s" en la 3ª persona singular.',
  },
};

const RAW_ADD_ES = [
  ['go', 'ir', 'goes'],
  ['do', 'hacer', 'does'],
  ['watch', 'mirar / observar', 'watches'],
  ['wash', 'lavar', 'washes'],
  ['kiss', 'besar', 'kisses'],
  ['fix', 'arreglar', 'fixes'],
  ['catch', 'atrapar', 'catches'],
  ['finish', 'terminar', 'finishes'],
];

const RAW_Y_TO_IES = [
  ['study', 'estudiar', 'studies'],
  ['try', 'intentar', 'tries'],
  ['fly', 'volar', 'flies'],
  ['cry', 'llorar', 'cries'],
  ['reply', 'responder', 'replies'],
];

const RAW_ADD_S = [
  ['play', 'jugar', 'plays'],
  ['say', 'decir', 'says'],
  ['buy', 'comprar', 'buys'],
  ['enjoy', 'disfrutar', 'enjoys'],
  ['stay', 'quedarse', 'stays'],
];

const buildGroup = (raw, rule) =>
  raw.map(([en, es, thirdPerson]) => ({
    id: slugify(en),
    en,
    es,
    thirdPerson,
    rule,
    ruleExplanation: RULES[rule].ruleExplanation,
  }));

export const spellingWords = [
  ...buildGroup(RAW_ADD_ES, 'add-es'),
  ...buildGroup(RAW_Y_TO_IES, 'y-to-ies'),
  ...buildGroup(RAW_ADD_S, 'add-s'),
];
