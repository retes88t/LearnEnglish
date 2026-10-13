import { useMemo, useState } from 'react';
import { shuffle } from '../../../utils/shuffle';
import SpeakButton from '../../../components/SpeakButton';
import { EL_LINES, getPrevious } from '../data/guion';
import './NextLineQuiz.css';

const OPTION_COUNT = 4;

// "¿Qué diálogo sigue?": se muestra la línea previa y el usuario elige la
// línea correcta de "Él" entre varias opciones. Los distractores salen solo
// de otras líneas de "Él" (EL_LINES), nunca de "Ella".
function buildQuestions() {
  return shuffle(EL_LINES).map((line) => {
    const distractors = shuffle(EL_LINES.filter((l) => l.id !== line.id && l.texto !== line.texto))
      .slice(0, OPTION_COUNT - 1)
      .map((l) => l.texto);
    return {
      id: line.id,
      previous: getPrevious(line.id),
      answer: line.texto,
      options: shuffle([line.texto, ...distractors]),
    };
  });
}

export default function NextLineQuiz({ registerAnswer }) {
  const [questions, setQuestions] = useState(buildQuestions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const percentage = useMemo(
    () => (questions.length > 0 ? Math.round((score / questions.length) * 100) : 0),
    [score, questions.length]
  );

  const restart = () => {
    setQuestions(buildQuestions());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const handleSelect = (option) => {
    if (selected) return;
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

  if (finished) {
    return (
      <section className="mode-panel">
        <header className="mode-header">
          <h2>¿Qué diálogo sigue?</h2>
        </header>
        <div className="exam-summary">
          <p className="exam-score">{percentage}%</p>
          <p>
            Respondiste correctamente {score} de {questions.length} preguntas.
          </p>
          <button type="button" className="btn btn-primary" onClick={restart}>
            Intentar de nuevo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>¿Qué diálogo sigue?</h2>
        <p>Lee la línea anterior y elige lo que dice Él a continuación.</p>
      </header>

      <p className="progress-indicator">
        Pregunta {index + 1} de {questions.length} · Aciertos: {score}
      </p>

      <div className="exam-question">
        <span className="flashcard-label">Línea anterior</span>
        <p className="exam-prompt exam-prompt-long">
          {current.previous ? current.previous.texto : '(inicio de la escena)'}
        </p>
      </div>

      <div className="options-grid">
        {current.options.map((option, optionIndex) => {
          let stateClass = '';
          if (selected) {
            if (option === current.answer) stateClass = 'option-correct';
            else if (option === selected) stateClass = 'option-incorrect';
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
              <SpeakButton text={option} lang="es-ES" />
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            {isLast ? 'Ver resultados' : 'Siguiente pregunta'}
          </button>
        </div>
      )}
    </section>
  );
}
