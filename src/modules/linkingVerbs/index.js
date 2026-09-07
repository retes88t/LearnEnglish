import { words } from './data/words';
import { SAMPLE_TEXTS } from './data/sampleTexts';

export const linkingVerbsModule = {
  id: 'linkingVerbs',
  navLabel: '🔗 Linking Verbs',
  title: '🔗 Linking Verbs en inglés',
  subtitle: 'Aprende los verbos de enlace y practica con flashcards.',
  storageKey: 'linking-verbs-progress-v1',
  words,
  labels: {
    front: 'Verb',
    back: 'Example',
    chooseBack: 'Choose the correct example',
    matchBack: 'Which linking verb matches this example?',
  },
  identify: {
    title: 'Identificar linking verbs',
    instructions:
      'Pega un texto en inglés y haz clic en cada palabra que creas que es un linking verb (verbo de enlace), en cualquiera de sus formas conjugadas (am, is, was, got, became...).',
    shortInstructions: 'Haz clic en las palabras que sean linking verbs.',
    nounSingular: 'linking verb',
    nounPlural: 'linking verbs',
    // Los linking verbs son una clase cerrada de ~19 verbos: no hace falta
    // (ni tiene sentido) una heurística de "parece verbo de enlace" como la
    // de los adjetivos, así que se omite `looksLikeExtra`.
    sampleTexts: SAMPLE_TEXTS,
  },
};
