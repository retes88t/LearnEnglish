import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ModuleTabs from './components/ModuleTabs';
import ModuleWorkspace from './components/ModuleWorkspace';
import { MODULES } from './modules';
import './App.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [moduleId, setModuleId] = useState(MODULES[0].id);
  const activeModule = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-shell">
      <ModuleTabs modules={MODULES} active={moduleId} onChange={setModuleId} />
      <ModuleWorkspace key={activeModule.id} module={activeModule} />
    </div>
  );
}

export default App;
