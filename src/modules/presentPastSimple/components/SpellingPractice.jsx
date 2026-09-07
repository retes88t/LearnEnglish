import { useMemo, useState } from 'react';
import { shuffle } from '../../../utils/shuffle';
import { spellingWords } from '../data/spellingWords';

// Sujetos de 3ª persona singular sobre los que se arma cada pregunta.
const SUBJECTS = ['He', 'She', 'It'];

// Resumen visual de las 3 reglas de spellingWords.js (T2), mostrado siempre
// como apoyo teórico corto (no solo texto plano), independientemente de qué
// verbo esté activo en el ejercicio.
const RULES = [
  {
    key: 'add-es',
    icon: '➕',
    title: '-es',
    text: 'Termina en "o", "ch", "sh", "ss" o "x"',
    example: 'watch → watches',
  },
  {
    key: 'y-to-ies',
    icon: '🔁',
    title: 'y → ies',
    text: 'Consonante + "y" final',
    example: 'study → studies',
  },
  {
    key: 'add-s',
    icon: '✔️',
    title: '-s',
    text: 'Resto de los casos (incluye vocal + "y")',
    example: 'play → plays',
  },
];

// Formas incorrectas "típicas" para un verbo dado: aplicar la regla
// equivocada (sumar "-s"/"-es" a lo bruto, o cambiar la "y" cuando no
// corresponde). Sirven de distractores pensados para poner a prueba
// justamente la regla que el verbo no sigue.
function wrongForms(word) {
  const { en, thirdPerson } = word;
  const candidates = new Set([`${en}s`, `${en}es`]);
  if (en.endsWith('y')) {
    candidates.add(`${en.slice(0, -1)}ies`);
  }
  candidates.delete(thirdPerson);
  candidates.delete(en);
  return [...candidates];
}

// Completa hasta 3 distractores: primero con las formas incorrectas
// "típicas" del propio verbo, y si no alcanzan, con formas correctas de
// otros verbos del banco (igual que ExamMode.jsx con sus distractores).
function buildOptions(word, pool) {
  const wrong = new Set(wrongForms(word));
  if (wrong.size < 3) {
    shuffle(pool.filter((w) => w.id !== word.id)).forEach((w) => {
      if (wrong.size >= 3 || w.thirdPerson === word.thirdPerson) return;
      wrong.add(w.thirdPerson);
    });
  }
  return shuffle([word.thirdPerson, ...[...wrong].slice(0, 3)]);
}

function buildDeck(words) {
  return shuffle(words).map((word) => ({
    ...word,
    subject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
    options: buildOptions(word, words),
  }));
}

// Reemplaza la función de "Identificar" para este módulo (ver context.md,
// decisión 2): en vez de pegar un texto libre, muestra un resumen visual de
// las reglas de ortografía de la 3ª persona singular y un ejercicio de
// selección múltiple para aplicarlas verbo a verbo.
export default function SpellingPractice({ getEntry, registerAnswer }) {
  const [deck, setDeck] = useState(() => buildDeck(spellingWords));
  const [onlyPending, setOnlyPending] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const visibleDeck = useMemo(() => {
    if (!onlyPending) return deck;
    const pending = deck.filter((word) => getEntry(word.id).status !== 'mastered');
    return pending.length > 0 ? pending : deck;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, onlyPending]);

  const safeIndex = index % visibleDeck.length;
  const current = visibleDeck[safeIndex];
  const currentRule = RULES.find((rule) => rule.key === current.rule);

  const reshuffle = () => {
    setDeck(buildDeck(spellingWords));
    setIndex(0);
    setSelected(null);
  };

  const goNext = () => {
    setSelected(null);
    setIndex((i) => (i + 1) % visibleDeck.length);
  };

  const goPrev = () => {
    setSelected(null);
    setIndex((i) => (i - 1 + visibleDeck.length) % visibleDeck.length);
  };

  const handleSelect = (option) => {
    if (selected) return; // ya se respondió este verbo
    const isCorrect = option === current.thirdPerson;
    setSelected(option);
    registerAnswer(current.id, isCorrect);
  };

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>Reglas ortográficas: 3ª persona singular</h2>
        <p>Presente simple afirmativo con he / she / it. Elige la forma correcta del verbo.</p>
      </header>

      <div className="spelling-rules-grid">
        {RULES.map((rule) => (
          <div
            key={rule.key}
            className={`spelling-rule-card ${current.rule === rule.key ? 'is-active' : ''}`}
          >
            <span className="spelling-rule-icon">{rule.icon}</span>
            <p className="spelling-rule-title">{rule.title}</p>
            <p className="spelling-rule-text">{rule.text}</p>
            <p className="spelling-rule-example">{rule.example}</p>
          </div>
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
              setSelected(null);
            }}
          />
          Repasar solo verbos pendientes
        </label>
        <button type="button" className="btn btn-ghost" onClick={reshuffle}>
          🔀 Mezclar de nuevo
        </button>
      </div>

      <p className="progress-indicator">
        Verbo {safeIndex + 1} de {visibleDeck.length} · Regla: {currentRule.title}
      </p>

      <div className="exam-question">
        <span className="flashcard-label">Completa la forma correcta</span>
        <p className="exam-prompt">
          {current.subject} ___ ({current.en})
        </p>
        <p className="flashcard-hint">{current.es}</p>
      </div>

      <div className="options-grid options-grid-single">
        {current.options.map((option, optionIndex) => {
          const isCorrectOption = option === current.thirdPerson;
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
          {selected === current.thirdPerson
            ? '✅ ¡Correcto!'
            : `❌ Incorrecto. La forma correcta es "${current.thirdPerson}" (${current.ruleExplanation})`}
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
