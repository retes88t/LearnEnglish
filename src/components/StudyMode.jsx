import { useMemo, useState } from 'react';
import { shuffle } from '../utils/shuffle';
import FlashCard from './FlashCard';

const STUDY_TYPES = [
  { key: 'definition', label: '🇬🇧 Solo inglés' },
  { key: 'translation', label: '🌐 Traducción' },
];

export default function StudyMode({ module, getEntry, registerAnswer }) {
  const { words, labels } = module;
  const [studyType, setStudyType] = useState('definition');
  const [onlyPending, setOnlyPending] = useState(true);
  const [deck, setDeck] = useState(() => shuffle(words));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const visibleDeck = useMemo(() => {
    if (!onlyPending) return deck;
    const pending = deck.filter((word) => getEntry(word.id).status !== 'mastered');
    return pending.length > 0 ? pending : deck;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, onlyPending]);

  const safeIndex = index % visibleDeck.length;
  const current = visibleDeck[safeIndex];
  const entry = getEntry(current.id);

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % visibleDeck.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + visibleDeck.length) % visibleDeck.length);
  };

  const handleAnswer = (isCorrect) => {
    registerAnswer(current.id, isCorrect);
    goNext();
  };

  const reshuffle = () => {
    setDeck(shuffle(words));
    setIndex(0);
    setFlipped(false);
  };

  const changeStudyType = (type) => {
    if (type === studyType) return;
    setStudyType(type);
    setFlipped(false);
  };

  const badge =
    entry.status === 'mastered'
      ? { type: 'mastered', label: '✅ Dominada' }
      : entry.seen > 0
        ? { type: 'learning', label: '🔁 En progreso' }
        : { type: 'new', label: '✨ Nueva' };

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>Modo estudio</h2>
        <p>
          {studyType === 'translation'
            ? 'Voltea la tarjeta, y marca si ya te la sabes o si necesitas repasarla.'
            : 'Relaciona la palabra con su versión solo en inglés, sin pasar por el español.'}
        </p>
      </header>

      <div className="filter-group">
        {STUDY_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`btn btn-ghost ${studyType === t.key ? 'is-active' : ''}`}
            onClick={() => changeStudyType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mode-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => {
              setOnlyPending(e.target.checked);
              setIndex(0);
              setFlipped(false);
            }}
          />
          Repasar solo palabras pendientes
        </label>
        <button type="button" className="btn btn-ghost" onClick={reshuffle}>
          🔀 Mezclar de nuevo
        </button>
      </div>

      <p className="progress-indicator">
        Tarjeta {safeIndex + 1} de {visibleDeck.length}
      </p>

      <div className="flashcard-nav-row">
        <button
          type="button"
          className="btn btn-ghost nav-arrow"
          onClick={goPrev}
          aria-label="Tarjeta anterior"
        >
          ◀
        </button>

        {studyType === 'translation' ? (
          <FlashCard
            front={current.en}
            back={current.es}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
            badge={badge}
          />
        ) : (
          <FlashCard
            front={current.en}
            back={current.enDef}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
            badge={badge}
            frontLabel={labels.front}
            backLabel={labels.back}
            backLang="en-US"
            dense
          />
        )}

        <button
          type="button"
          className="btn btn-ghost nav-arrow"
          onClick={goNext}
          aria-label="Tarjeta siguiente"
        >
          ▶
        </button>
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-danger" onClick={() => handleAnswer(false)}>
          ❌ Necesito repasar
        </button>
        <button type="button" className="btn btn-success" onClick={() => handleAnswer(true)}>
          ✅ Ya me la sé
        </button>
      </div>
    </section>
  );
}
