import { useState } from 'react';
import Nav from './Nav';
import StudyMode from './StudyMode';
import ExamMode from './ExamMode';
import IdentifyMode from './IdentifyMode';
import ProgressBoard from './ProgressBoard';
import { useProgress } from '../hooks/useProgress';

// Pestañas por defecto (las 4 de siempre) para cualquier módulo que no
// declare su propio `tabs`. Los `key`/`label` coinciden con el default de
// `Nav.jsx`.
const DEFAULT_MODULE_TABS = [
  { key: 'study', label: '📖 Estudio', Component: StudyMode },
  { key: 'exam', label: '📝 Examen', Component: ExamMode },
  { key: 'identify', label: '🔍 Identificar', Component: IdentifyMode },
  { key: 'progress', label: '📊 Progreso', Component: ProgressBoard },
];

// Todo el estado de práctica (pestaña activa + progreso) de un módulo vive
// aquí. App.jsx monta este componente con `key={module.id}`, así que cambiar
// de módulo lo remonta desde cero: no hay que resetear nada a mano.
export default function ModuleWorkspace({ module }) {
  const tabs = module.tabs ?? DEFAULT_MODULE_TABS;
  const [tab, setTab] = useState(tabs[0].key);
  const { getEntry, registerAnswer, resetProgress, stats } = useProgress(module);

  const activeTab = tabs.find((t) => t.key === tab) ?? tabs[0];
  const ActiveComponent = activeTab.Component;

  return (
    <>
      <header className="app-header">
        <h1>{module.title}</h1>
        <p>{module.subtitle}</p>
      </header>

      <Nav active={activeTab.key} onChange={setTab} tabs={tabs} />

      <main className="app-main">
        <ActiveComponent
          module={module}
          getEntry={getEntry}
          registerAnswer={registerAnswer}
          // `stats`/`resetProgress` solo los necesita la pestaña de progreso
          // (hoy `ProgressBoard`); se pasan igual que antes, identificando esa
          // pestaña por convención de `key: 'progress'`.
          {...(activeTab.key === 'progress' ? { stats, resetProgress } : {})}
        />
      </main>

      <footer className="app-footer">
        <span>Tu progreso se guarda automáticamente en este navegador.</span>
      </footer>
    </>
  );
}
