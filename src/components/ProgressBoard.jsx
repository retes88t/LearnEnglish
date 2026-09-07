import { useMemo, useState } from 'react';

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Por repasar' },
  { key: 'dominada', label: 'Dominadas' },
];

export default function ProgressBoard({ module, getEntry, stats, resetProgress }) {
  const [filter, setFilter] = useState('pendiente');

  const rows = useMemo(() => {
    const withEntry = module.words.map((word) => ({ word, entry: getEntry(word.id) }));

    const filtered = withEntry.filter(({ entry }) => {
      if (filter === 'dominada') return entry.status === 'mastered';
      if (filter === 'pendiente') return entry.status !== 'mastered';
      return true;
    });

    // Prioriza lo que más necesita repaso: más fallos primero, luego menos racha.
    return filtered.sort((a, b) => {
      if (b.entry.wrong !== a.entry.wrong) return b.entry.wrong - a.entry.wrong;
      return a.entry.streak - b.entry.streak;
    });
  }, [filter, getEntry, module]);

  const handleReset = () => {
    if (window.confirm('¿Seguro que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
      resetProgress();
    }
  };

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>Tu progreso</h2>
        <p>Revisa qué palabras ya dominas y cuáles necesitas seguir repasando.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Palabras totales</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.nuevas}</span>
          <span className="stat-label">Nuevas</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.enProgreso}</span>
          <span className="stat-label">En progreso</span>
        </div>
        <div className="stat-card stat-card-highlight">
          <span className="stat-value">{stats.dominadas}</span>
          <span className="stat-label">Dominadas</span>
        </div>
      </div>

      <div className="overall-bar">
        <div className="overall-bar-fill" style={{ width: `${stats.porcentajeDominado}%` }} />
      </div>
      <p className="overall-bar-label">{stats.porcentajeDominado}% del vocabulario dominado</p>

      <div className="mode-controls">
        <div className="filter-group">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`btn btn-ghost ${filter === f.key ? 'is-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-danger" onClick={handleReset}>
          🗑️ Reiniciar progreso
        </button>
      </div>

      <div className="word-list">
        {rows.length === 0 && <p className="empty-state">No hay palabras en esta categoría. 🎉</p>}
        {rows.map(({ word, entry }) => (
          <div key={word.id} className={`word-row status-${entry.status === 'mastered' ? 'mastered' : entry.seen > 0 ? 'learning' : 'new'}`}>
            <div className="word-row-text">
              <strong>{word.en}</strong>
              <span>{word.es}</span>
            </div>
            <div className="word-row-meta">
              <span className="pill">Racha: {entry.streak}</span>
              <span className="pill">Aciertos: {entry.correct}</span>
              <span className="pill">Fallos: {entry.wrong}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
