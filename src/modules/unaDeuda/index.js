import { EL_LINES } from './data/guion';
import UnaDeudaStudy from './components/UnaDeudaStudy';
import NextLineQuiz from './components/NextLineQuiz';
import OpenExam from './components/OpenExam';
import FullScriptExam from './components/FullScriptExam';
import ProgressiveErase from './components/ProgressiveErase';
import ProgressBoard from '../../components/ProgressBoard';

// Módulo temporal para aprender el guion de "Una deuda". Autocontenido:
// para quitarlo basta borrar esta carpeta y su línea en `../index.js`.
export const unaDeudaModule = {
  id: 'unaDeuda',
  navLabel: 'Una deuda',
  title: 'Una deuda',
  subtitle: 'Aprende de memoria tus líneas del guion.',
  storageKey: 'una-deuda-progress-v1',
  words: EL_LINES,
  tabs: [
    { key: 'study', label: 'Estudio', Component: UnaDeudaStudy },
    { key: 'quiz', label: 'Opción múltiple', Component: NextLineQuiz },
    { key: 'exam', label: 'Examen', Component: OpenExam },
    { key: 'full', label: 'Guion completo', Component: FullScriptExam },
    { key: 'erase', label: 'Borrado progresivo', Component: ProgressiveErase },
    { key: 'progress', label: 'Progreso', Component: ProgressBoard },
  ],
};
