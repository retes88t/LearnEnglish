import { verbSentences } from './data/verbSentences';
import { spellingWords } from './data/spellingWords';
import ConjugationStudy from './components/ConjugationStudy';
import ConjugationExam from './components/ConjugationExam';
import SpellingPractice from './components/SpellingPractice';
import ProgressBoard from '../../components/ProgressBoard';

// `words` es la unión de los dos bancos de datos del módulo: las oraciones
// de to be / do-does-did (T1) y los verbos de ortografía (T2). Ambos exponen
// `{ id, en, es, ... }`, así que sirven tal cual para `useProgress` y
// `ProgressBoard` sin modificarlos.
const words = [...verbSentences, ...spellingWords];

export const presentPastSimpleModule = {
  id: 'presentPastSimple',
  navLabel: '⏱️ Present & Past Simple',
  title: '⏱️ Present & Past Simple en inglés',
  subtitle: 'Practica el verbo to be, los auxiliares do/does/did y las reglas de ortografía de la 3ª persona.',
  storageKey: 'present-past-simple-progress-v1',
  words,
  // Este módulo reemplaza las 4 pestañas fijas por las suyas propias (ver
  // `ModuleWorkspace.jsx`): Estudio y Examen de conjugación, Reglas
  // ortográficas (en vez de "Identificar") y Progreso genérico.
  tabs: [
    { key: 'study', label: '📖 Estudio', Component: ConjugationStudy },
    { key: 'exam', label: '📝 Examen', Component: ConjugationExam },
    { key: 'rules', label: '🔤 Reglas', Component: SpellingPractice },
    { key: 'progress', label: '📊 Progreso', Component: ProgressBoard },
  ],
};
