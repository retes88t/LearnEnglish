import { useMemo, useState } from 'react';
import { shuffle } from '../../../utils/shuffle';
import { verbSentences } from '../data/verbSentences';

// Etiquetas en español para el contexto gramatical de cada oración
// (`type`/`tense`/`polarity` vienen de verbSentences.js, T1).
const TYPE_LABEL = { be: 'to be', do: 'do / does / did' };
const TENSE_LABEL = { present: 'Presente', past: 'Pasado' };
const POLARITY_LABEL = {
  affirmative: 'Afirmativa',
  negative: 'Negativa',
  interrogative: 'Interrogativa',
};

// Modo estudio (drill sin puntaje): recorre el banco de oraciones de T1,
// mostrando una oración con blank y opciones de selección múltiple. Sigue el
// mismo esqueleto de mazo/índice que StudyMode.jsx, pero adaptado a MCQ con
// feedback inmediato (como ExamMode.jsx) en vez de flashcard con volteo.
export default function ConjugationStudy({ getEntry, registerAnswer }) {
  const [deck, setDeck] = useState(() => shuffle(verbSentences));
  const [onlyPending, setOnlyPending] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const visibleDeck = useMemo(() => {
    if (!onlyPending) return deck;
    const pending = deck.filter((item) => getEntry(item.id).status !== 'mastered');
    return pending.length > 0 ? pending : deck;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, onlyPending]);

  const safeIndex = index % visibleDeck.length;
  const current = visibleDeck[safeIndex];

  const goNext = () => {
    setSelected(null);
    setIndex((i) => (i + 1) % visibleDeck.length);
  };

  const goPrev = () => {
    setSelected(null);
    setIndex((i) => (i - 1 + visibleDeck.length) % visibleDeck.length);
  };

  const reshuffle = () => {
    setDeck(shuffle(verbSentences));
    setIndex(0);
    setSelected(null);
  };

  const handleSelect = (option) => {
    if (selected) return; // ya se respondió esta oración
    const isCorrect = option === current.answer;
    setSelected(option);
    registerAnswer(current.id, isCorrect);
  };

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>Modo estudio: to be / do-does-did</h2>
        <p>Completa el espacio en blanco con la forma correcta. Sin puntaje: practicá a tu ritmo.</p>
      </header>

      <div className="mode-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => {
              setOnlyPending(e.target.checked);
              setIndex(0);
              setSelected(null);
            }}
          />
          Repasar solo oraciones pendientes
        </label>
        <button type="button" className="btn btn-ghost" onClick={reshuffle}>
          🔀 Mezclar de nuevo
        </button>
      </div>

      <p className="progress-indicator">
        Oración {safeIndex + 1} de {visibleDeck.length} · {TYPE_LABEL[current.type]} ·{' '}
        {TENSE_LABEL[current.tense]} · {POLARITY_LABEL[current.polarity]}
      </p>

      <div className="exam-question">
        <span className="flashcard-label">Completa la oración</span>
        <p className="exam-prompt">{current.prompt}</p>
      </div>

      <div className="options-grid">
        {current.options.map((option, optionIndex) => {
          const isCorrectOption = option === current.answer;
          const isSelected = option === selected;
          let stateClass = '';
          if (selected) {
            if (isCorrectOption) stateClass = 'option-correct';
            else if (isSelected) stateClass = 'option-incorrect';
          }
          return (
            <div key={`${safeIndex}-${optionIndex}`} className={`option-row ${stateClass}`}>
              <button
                type="button"
                className="option-btn"
                onClick={() => handleSelect(option)}
                disabled={Boolean(selected)}
              >
                {option}
              </button>
            </div>
          );
        })}
      </div>

      {selected && (
        <p className="progress-indicator">
          {selected === current.answer
            ? '✅ ¡Correcto!'
            : `❌ Incorrecto. La respuesta correcta es "${current.answer}".`}
        </p>
      )}

      <div className="action-row">
        <button type="button" className="btn btn-ghost" onClick={goPrev}>
          ◀ Anterior
        </button>
        <button type="button" className="btn btn-primary" onClick={goNext}>
          Siguiente ➡️
        </button>
      </div>
    </section>
  );
}
