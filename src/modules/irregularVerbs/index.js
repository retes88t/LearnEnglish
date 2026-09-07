import { words } from './data/words';
import { SAMPLE_TEXTS } from './data/sampleTexts';

export const irregularVerbsModule = {
  id: 'irregularVerbs',
  navLabel: '⏳ Irregular Verbs',
  title: '⏳ Irregular Verbs en inglés',
  subtitle: 'Aprende los verbos irregulares y practica con flashcards.',
  storageKey: 'irregular-verbs-progress-v1',
  words,
  labels: {
    front: 'Base Form',
    back: 'Past Simple / Past Participle',
    chooseBack: 'Choose the correct past simple and past participle',
    matchBack: 'Which verb matches these past simple and past participle forms?',
  },
  identify: {
    title: 'Identificar verbos irregulares',
    instructions:
      'Pega un texto en inglés y haz clic en cada palabra que creas que es un verbo irregular, en cualquiera de sus formas (base, pasado simple o participio pasado).',
    shortInstructions: 'Haz clic en las palabras que sean verbos irregulares.',
    nounSingular: 'verbo irregular',
    nounPlural: 'verbos irregulares',
    // Los verbos irregulares son una clase cerrada: no hace falta (ni tiene
    // sentido) una heurística de "parece verbo irregular" como la de los
    // adjetivos, así que se omite `looksLikeExtra`.
    sampleTexts: SAMPLE_TEXTS,
  },
};
