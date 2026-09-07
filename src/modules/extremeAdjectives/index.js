import { words } from './data/words';
import { COMMON_EXTREME_ADJECTIVES } from './data/commonWords';
import { SAMPLE_TEXTS } from './data/sampleTexts';

// Para una palabra marcada que no está en la lista de práctica, revisa si al
// menos "parece" un extreme adjective real contra un diccionario de
// referencia curado a mano (ver commonWords.js). Es una heurística, no un
// análisis gramatical real, así que puede fallar con formas raras o
// informales que no estén en la lista.
function looksLikeExtremeAdjective(rawWord) {
  return COMMON_EXTREME_ADJECTIVES.has(rawWord.toLowerCase());
}

export const extremeAdjectivesModule = {
  id: 'extremeAdjectives',
  navLabel: '🔥 Extreme Adjectives',
  title: '🔥 Extreme Adjectives en inglés',
  subtitle: 'Aprende los adjetivos extremos (no graduables) y practica con flashcards.',
  storageKey: 'extreme-adjectives-progress-v1',
  words,
  labels: {
    front: 'Word',
    back: 'Definition',
    chooseBack: 'Choose the correct definition',
    matchBack: 'Which word matches this definition?',
  },
  identify: {
    title: 'Identificar extreme adjectives',
    instructions:
      'Pega un texto en inglés y haz clic en cada palabra que creas que es un extreme adjective (adjetivo extremo, como "huge" o "furious").',
    shortInstructions: 'Haz clic en las palabras que sean extreme adjectives.',
    nounSingular: 'extreme adjective',
    nounPlural: 'extreme adjectives',
    unknownOutsideHint:
      'nuestro diccionario de referencia es limitado, así que podría seguir siendo válida',
    looksLikeExtra: looksLikeExtremeAdjective,
    sampleTexts: SAMPLE_TEXTS,
  },
};
