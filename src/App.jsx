import { useState } from 'react';
import ModuleTabs from './components/ModuleTabs';
import ModuleWorkspace from './components/ModuleWorkspace';
import { MODULES } from './modules';
import './App.css';

function App() {
  const [moduleId, setModuleId] = useState(MODULES[0].id);
  const activeModule = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];

  return (
    <div className="app-shell">
      <ModuleTabs modules={MODULES} active={moduleId} onChange={setModuleId} />
      <ModuleWorkspace key={activeModule.id} module={activeModule} />
    </div>
  );
}

export default App;
