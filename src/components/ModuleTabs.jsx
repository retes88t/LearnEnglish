export default function ModuleTabs({ modules, active, onChange }) {
  return (
    <nav className="nav-tabs module-tabs">
      {modules.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`nav-tab ${active === m.id ? 'is-active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          {m.navLabel}
        </button>
      ))}
    </nav>
  );
}
