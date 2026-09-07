import { useMemo, useState } from 'react';
import { shuffle } from '../utils/shuffle';
import SpeakButton from './SpeakButton';

const QUIZ_TYPE_META = [
  { key: 'translation', label: '🌐 Traducción' },
  { key: 'definition', label: '🇬🇧 Solo inglés' },
];

export default function ExamMode({ module, getEntry, registerAnswer }) {
  const { words, labels } = module;

  // Elige hasta `count` textos distractores del pool, evitando cualquiera
  // que coincida (como texto, no solo como palabra) con `usedTexts`. Algunas
  // palabras de un mismo módulo pueden compartir traducción o ejemplo (p.ej.
  // "get" y "turn" -> "ponerse / volverse" en linking verbs); sin este
  // filtro, dos opciones podrían mostrar el mismo texto en la misma
  // pregunta, lo que además rompe la key de React al renderizarlas.
  const pickDistractorTexts = (pool, usedTexts, count) => {
    const distractors = [];
    for (const text of pool) {
      if (usedTexts.has(text)) continue;
      usedTexts.add(text);
      distractors.push(text);
      if (distractors.length === count) break;
    }
    return distractors;
  };

  // Examen clásico: traduce entre inglés y español, dirección al azar.
  // `pool` son las palabras candidatas a preguntar (todas, o solo las no
  // dominadas); los distractores siempre se buscan en `words` completo para
  // tener variedad aunque el pool esté reducido.
  const buildTranslationQuestions = (pool) => {
    const questionCount = Math.min(15, pool.length);
    const chosen = shuffle(pool).slice(0, questionCount);
    return chosen.map((word) => {
      const direction = Math.random() < 0.5 ? 'en-es' : 'es-en';
      const prompt = direction === 'en-es' ? word.en : word.es;
      const answer = direction === 'en-es' ? word.es : word.en;

      const pool = shuffle(words.filter((w) => w.id !== word.id)).map((w) =>
        direction === 'en-es' ? w.es : w.en
      );
      const distractors = pickDistractorTexts(pool, new Set([answer]), 3);

      return {
        id: word.id,
        prompt,
        answer,
        promptLang: direction === 'en-es' ? 'en-US' : 'es-ES',
        // Las opciones están en el idioma contrario al prompt.
        optionLang: direction === 'en-es' ? 'es-ES' : 'en-US',
        options: shuffle([answer, ...distractors]),
        label: direction === 'en-es' ? 'Traduce al español' : 'Traduce al inglés',
        longPrompt: false,
      };
    });
  };

  // Examen solo en inglés: relaciona la palabra con su versión solo en
  // inglés (definición o ejemplo, según el módulo), sin pasar por el
  // español en ningún momento.
  const buildDefinitionQuestions = (pool) => {
    const questionCount = Math.min(15, pool.length);
    const chosen = shuffle(pool).slice(0, questionCount);
    return chosen.map((word) => {
      const direction = Math.random() < 0.5 ? 'word-to-def' : 'def-to-word';
      const prompt = direction === 'word-to-def' ? word.en : word.enDef;
      const answer = direction === 'word-to-def' ? word.enDef : word.en;

      const pool = shuffle(words.filter((w) => w.id !== word.id)).map((w) =>
        direction === 'word-to-def' ? w.enDef : w.en
      );
      const distractors = pickDistractorTexts(pool, new Set([answer]), 3);

      return {
        id: word.id,
        prompt,
        answer,
        // Tanto word.en como word.enDef son inglés, así que el prompt y las
        // opciones de esta modalidad siempre se leen en inglés.
        promptLang: 'en-US',
        optionLang: 'en-US',
        options: shuffle([answer, ...distractors]),
        label: direction === 'word-to-def' ? labels.chooseBack : labels.matchBack,
        longPrompt: direction === 'def-to-word',
      };
    });
  };

  const QUIZ_TYPES = QUIZ_TYPE_META.map((meta) => ({
    ...meta,
    build: meta.key === 'translation' ? buildTranslationQuestions : buildDefinitionQuestions,
  }));

  // Palabras que todavía no están dominadas (racha < 3). Si no queda
  // ninguna (todo dominado), usamos el mazo completo como respaldo para no
  // dejar el examen vacío.
  const getPool = (onlyPending) => {
    if (!onlyPending) return { pool: words, usedFallback: false };
    const pending = words.filter((word) => getEntry(word.id).status !== 'mastered');
    return pending.length > 0 ? { pool: pending, usedFallback: false } : { pool: words, usedFallback: true };
  };

  const [quizType, setQuizType] = useState('translation');
  const [onlyPending, setOnlyPending] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [questions, setQuestions] = useState(() => buildTranslationQuestions(words));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const buildFor = (type) => QUIZ_TYPES.find((t) => t.key === type).build;

  const restartWith = (type, pending = onlyPending) => {
    const { pool, usedFallback: fellBack } = getPool(pending);
    setQuizType(type);
    setOnlyPending(pending);
    setUsedFallback(fellBack);
    setQuestions(buildFor(type)(pool));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = (option) => {
    if (selected) return; // ya se respondió esta pregunta
    const isCorrect = option === current.answer;
    setSelected(option);
    setScore((s) => s + (isCorrect ? 1 : 0));
    registerAnswer(current.id, isCorrect);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const percentage = useMemo(
    () => Math.round((score / questions.length) * 100),
    [score, questions.length]
  );

  const typeSwitcher = (
    <div className="filter-group">
      {QUIZ_TYPES.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`btn btn-ghost ${quizType === t.key ? 'is-active' : ''}`}
          onClick={() => restartWith(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  if (finished) {
    return (
      <section className="mode-panel">
        <header className="mode-header">
          <h2>Modo examen</h2>
        </header>
        {typeSwitcher}
        <div className="mode-controls">
          <label className="toggle">
            <input
              type="checkbox"
              checked={onlyPending}
              onChange={(e) => restartWith(quizType, e.target.checked)}
            />
            Repasar solo palabras no dominadas
          </label>
        </div>
        <div className="exam-summary">
          <p className="exam-score">{percentage}%</p>
          <p>
            Respondiste correctamente {score} de {questions.length} preguntas.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => restartWith(quizType)}>
            🔁 Intentar de nuevo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>Modo examen</h2>
        <p>
          {quizType === 'translation'
            ? 'Elige la traducción correcta. Cada respuesta actualiza tu progreso.'
            : 'Relaciona cada palabra con su versión en inglés, todo en inglés.'}
        </p>
      </header>

      {typeSwitcher}

      <div className="mode-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={onlyPending}
            onChange={(e) => restartWith(quizType, e.target.checked)}
          />
          Repasar solo palabras no dominadas
        </label>
      </div>

      {onlyPending && usedFallback && (
        <p className="progress-indicator">
          🎉 ¡Ya dominas todas las palabras! Te mostramos un repaso general.
        </p>
      )}

      <p className="progress-indicator">
        Pregunta {index + 1} de {questions.length} · Aciertos: {score}
      </p>

      <div className="exam-question">
        <span className="flashcard-label">{current.label}</span>
        <div className="exam-prompt-row">
          <p className={`exam-prompt ${current.longPrompt ? 'exam-prompt-long' : ''}`}>{current.prompt}</p>
          <SpeakButton text={current.prompt} lang={current.promptLang} />
        </div>
      </div>

      <div className={`options-grid ${quizType === 'definition' ? 'options-grid-single' : ''}`}>
        {current.options.map((option, optionIndex) => {
          const isCorrectOption = option === current.answer;
          const isSelected = option === selected;
          let stateClass = '';
          if (selected) {
            if (isCorrectOption) stateClass = 'option-correct';
            else if (isSelected) stateClass = 'option-incorrect';
          }
          return (
            <div key={`${index}-${optionIndex}`} className={`option-row ${stateClass}`}>
              <button
                type="button"
                className="option-btn"
                onClick={() => handleSelect(option)}
                disabled={Boolean(selected)}
              >
                {option}
              </button>
              <SpeakButton text={option} lang={current.optionLang} />
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            {isLast ? 'Ver resultados' : 'Siguiente pregunta ➡️'}
          </button>
        </div>
      )}
    </section>
  );
}
