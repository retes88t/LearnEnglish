import { useMemo, useState } from 'react';
import { shuffle } from '../../../utils/shuffle';
import { verbSentences } from '../data/verbSentences';

const QUESTION_COUNT = 15;

// Examen con puntaje sobre el banco de oraciones de "to be" / do-does-did
// (`verbSentences.js`, T1). Sigue el mismo patrón que `ExamMode.jsx`
// (selección aleatoria de preguntas, repaso de pendientes, puntaje
// acumulado, resumen final con reintento), pero cada pregunta ya trae su
// `prompt` (oración con blank), `answer` y `options` armados de antemano en
// el banco de datos, así que no hace falta construir distractores acá.
export default function ConjugationExam({ getEntry, registerAnswer }) {
  // Oraciones que todavía no están dominadas (racha < 3). Si no queda
  // ninguna, usamos el banco completo como respaldo para no dejar el examen
  // vacío, igual que en `ExamMode`.
  const getPool = (onlyPending) => {
    if (!onlyPending) return { pool: verbSentences, usedFallback: false };
    const pending = verbSentences.filter((item) => getEntry(item.id).status !== 'mastered');
    return pending.length > 0 ? { pool: pending, usedFallback: false } : { pool: verbSentences, usedFallback: true };
  };

  const buildQuestions = (pool) => {
    const questionCount = Math.min(QUESTION_COUNT, pool.length);
    return shuffle(pool)
      .slice(0, questionCount)
      .map((item) => ({
        id: item.id,
        prompt: item.prompt,
        answer: item.answer,
        options: shuffle(item.options),
      }));
  };

  const [onlyPending, setOnlyPending] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [questions, setQuestions] = useState(() => buildQuestions(verbSentences));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const restartWith = (pending = onlyPending) => {
    const { pool, usedFallback: fellBack } = getPool(pending);
    setOnlyPending(pending);
    setUsedFallback(fellBack);
    setQuestions(buildQuestions(pool));
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
    () => (questions.length > 0 ? Math.round((score / questions.length) * 100) : 0),
    [score, questions.length]
  );

  const pendingToggle = (
    <div className="mode-controls">
      <label className="toggle">
        <input
          type="checkbox"
          checked={onlyPending}
          onChange={(e) => restartWith(e.target.checked)}
        />
        Repasar solo oraciones no dominadas
      </label>
    </div>
  );

  if (finished) {
    return (
      <section className="mode-panel">
        <header className="mode-header">
          <h2>Examen: Present &amp; Past Simple</h2>
        </header>

        {pendingToggle}

        <div className="exam-summary">
          <p className="exam-score">{percentage}%</p>
          <p>
            Respondiste correctamente {score} de {questions.length} preguntas.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => restartWith(onlyPending)}>
            🔁 Intentar de nuevo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>Examen: Present &amp; Past Simple</h2>
        <p>Elige la forma correcta de "to be" o del auxiliar do/does/did para completar la oración.</p>
      </header>

      {pendingToggle}

      {onlyPending && usedFallback && (
        <p className="progress-indicator">
          🎉 ¡Ya dominas todas las oraciones! Te mostramos un repaso general.
        </p>
      )}

      <p className="progress-indicator">
        Pregunta {index + 1} de {questions.length} · Aciertos: {score}
      </p>

      <div className="exam-question">
        <span className="flashcard-label">Completa la oración</span>
        <p className="exam-prompt exam-prompt-long">{current.prompt}</p>
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
            <div key={`${index}-${optionIndex}`} className={`option-row ${stateClass}`}>
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
        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            {isLast ? 'Ver resultados' : 'Siguiente pregunta ➡️'}
          </button>
        </div>
      )}
    </section>
  );
}
