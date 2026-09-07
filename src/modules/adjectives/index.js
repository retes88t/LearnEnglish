import { words } from './data/words';
import { COMMON_ADJECTIVES } from './data/commonWords';
import { SAMPLE_TEXTS } from './data/sampleTexts';

// Para una palabra marcada que no está en la lista de práctica, revisa si al
// menos "parece" un adjetivo real contra un diccionario de referencia más
// amplio (~1100 palabras). Incluye una comprobación simple de comparativo/
// superlativo ("faster" -> "fast", "biggest" -> "big"). Es una heurística,
// no un análisis gramatical real, así que puede fallar con formas raras.
// Tiene sentido solo porque los adjetivos son una clase abierta (hay miles
// que no están en ninguna lista); los módulos de clase cerrada (como los
// linking verbs) no necesitan esta heurística.
function looksLikeAdjective(rawWord) {
  const word = rawWord.toLowerCase();
  if (COMMON_ADJECTIVES.has(word)) return true;

  if (word.endsWith('est') && word.length > 5) {
    const stem = word.slice(0, -3);
    if (COMMON_ADJECTIVES.has(stem)) return true;
    if (COMMON_ADJECTIVES.has(stem.slice(0, -1))) return true; // biggest -> bigg -> big
  }
  if (word.endsWith('er') && word.length > 4) {
    const stem = word.slice(0, -2);
    if (COMMON_ADJECTIVES.has(stem)) return true;
    if (COMMON_ADJECTIVES.has(stem.slice(0, -1))) return true; // hotter -> hott -> hot
  }
  return false;
}

export const adjectivesModule = {
  id: 'adjectives',
  navLabel: '🧠 Adjetivos',
  title: '🧠 Adjetivos en inglés',
  subtitle: 'Aprende, practica y sigue tu progreso con flashcards.',
  storageKey: 'adjetivos-progress-v1',
  words,
  labels: {
    front: 'Word',
    back: 'Definition',
    chooseBack: 'Choose the correct definition',
    matchBack: 'Which word matches this definition?',
  },
  identify: {
    title: 'Identificar adjetivos',
    instructions:
      'Pega un texto en inglés y haz clic en cada palabra que creas que es un adjetivo. Puede haber adjetivos que no estén en tu lista de práctica.',
    shortInstructions: 'Haz clic en las palabras que sean adjetivos.',
    nounSingular: 'adjetivo',
    nounPlural: 'adjetivos',
    unknownOutsideHint:
      'nuestro diccionario de referencia es limitado, así que podría seguir siendo válida',
    looksLikeExtra: looksLikeAdjective,
    sampleTexts: SAMPLE_TEXTS,
  },
};
