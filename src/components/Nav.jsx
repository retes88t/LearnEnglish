const DEFAULT_TABS = [
  { key: 'study', label: '📖 Estudio' },
  { key: 'exam', label: '📝 Examen' },
  { key: 'identify', label: '🔍 Identificar' },
  { key: 'progress', label: '📊 Progreso' },
];

export default function Nav({ active, onChange, tabs = DEFAULT_TABS }) {
  return (
    <nav className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`nav-tab ${active === tab.key ? 'is-active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
