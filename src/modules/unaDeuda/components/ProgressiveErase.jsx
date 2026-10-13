import { useState } from 'react';
import SpeakButton from '../../../components/SpeakButton';
import { shuffle } from '../../../utils/shuffle';
import { normalize } from '../utils/compare';
import { getPrevious } from '../data/guion';
import './ProgressiveErase.css';

// Porcentaje de palabras ocultas por nivel.
const LEVELS = [0, 25, 50, 75, 100];

// Criterio de registro en el progreso (useProgress):
// - Fallo: se registra registerAnswer(id, false) cada vez que el usuario falla
//   la comprobación de cualquier nivel (el nivel se repite).
// - Acierto: se registra registerAnswer(id, true) solo al completar el nivel 100%.
// Los niveles intermedios acertados no se registran.

// Separa la puntuación de los bordes del token para dejarla fuera del campo.
function splitToken(text) {
  const match = text.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
  return { before: match[1], core: match[2], after: match[3] };
}

// Arma una ronda: línea al azar (distinta de la anterior) y un orden aleatorio
// fijo de palabras; cada nivel oculta un prefijo de ese orden, así la selección
// es estable durante toda la ronda y los niveles son anidados.
function buildRound(words, previousId) {
  if (words.length === 0) return null;
  const candidates = words.length > 1 ? words.filter((w) => w.id !== previousId) : words;
  const word = candidates[Math.floor(Math.random() * candidates.length)];
  const tokens = word.en.split(/\s+/).filter(Boolean);
  const eligible = tokens
    .map((t, i) => (normalize(t) ? i : -1))
    .filter((i) => i >= 0);
  return { word, tokens, order: shuffle(eligible) };
}

function hiddenSet(round, level) {
  const count = Math.ceil((round.order.length * LEVELS[level]) / 100);
  return new Set(round.order.slice(0, count));
}

function EraseRound({ words, registerAnswer }) {
  const [round, setRound] = useState(() => buildRound(words, null));
  const [level, setLevel] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  if (!round) return <p className="progress-indicator">No hay líneas disponibles.</p>;

  const { word, tokens } = round;
  const hidden = hiddenSet(round, level);
  const holeIndexes = tokens.map((_, i) => i).filter((i) => hidden.has(i));
  const isHoleCorrect = (i) => normalize(answers[i] ?? '') === normalize(tokens[i]);
  const allCorrect = holeIndexes.every(isHoleCorrect);
  const isLast = level === LEVELS.length - 1;
  const previous = getPrevious(word.id);

  const handleCheck = (e) => {
    e.preventDefault();
    if (checked) return;
    setChecked(true);
    if (!allCorrect) registerAnswer(word.id, false);
    else if (isLast) registerAnswer(word.id, true);
  };

  const handleContinue = () => {
    setAnswers({});
    setChecked(false);
    if (checked && allCorrect && !isLast) setLevel(level + 1);
  };

  const handleNewLine = () => {
    setRound(buildRound(words, word.id));
    setLevel(0);
    setAnswers({});
    setChecked(false);
  };

  return (
    <form className="erase-card" onSubmit={handleCheck}>
      <span className="erase-progress">Nivel {level + 1} de {LEVELS.length}: {LEVELS[level]}% oculto</span>

      {previous && (
        <>
          <span className="flashcard-label">Contexto previo</span>
          <p className="erase-context">{previous.texto}</p>
        </>
      )}

      <span className="flashcard-label">Completa tu línea</span>
      <p className="erase-sentence">
        {tokens.map((token, i) => {
          if (!hidden.has(i)) return <span key={i} className="erase-word">{token}</span>;
          const { before, core, after } = splitToken(token);
          const state = checked ? (isHoleCorrect(i) ? 'is-correct' : 'is-wrong') : '';
          return (
            <span key={i} className="erase-word">
              {before}
              <input
                type="text"
                className={`erase-input ${state}`}
                style={{ width: `${Math.max(core.length, 3) + 2}ch` }}
                value={answers[i] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                disabled={checked}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label={`Hueco ${holeIndexes.indexOf(i) + 1}`}
              />
              {after}
              {checked && !isHoleCorrect(i) && <span className="erase-solution"> ✗ {core}</span>}
              {checked && isHoleCorrect(i) && <span className="erase-solution is-ok"> ✓</span>}
            </span>
          );
        })}
        <SpeakButton text={word.en} lang="es-ES" />
      </p>

      {checked && (
        <p className={`erase-feedback ${allCorrect ? 'is-correct' : 'is-wrong'}`} role="status">
          {allCorrect
            ? isLast ? 'Correcto. ¡Línea completada de memoria!' : 'Correcto. Subís de nivel.'
            : `Incorrecto. Línea completa: ${word.en}`}
        </p>
      )}

      <div className="action-row">
        {!checked && (
          <button type="submit" className="btn btn-primary">
            {holeIndexes.length === 0 ? 'Continuar' : 'Comprobar'}
          </button>
        )}
        {checked && !(allCorrect && isLast) && (
          <button type="button" className="btn btn-primary" onClick={handleContinue}>
            {allCorrect ? 'Siguiente nivel' : 'Repetir nivel'}
          </button>
        )}
        {checked && allCorrect && isLast && (
          <button type="button" className="btn btn-primary" onClick={handleNewLine}>
            Otra línea
          </button>
        )}
      </div>
    </form>
  );
}

// Borrado progresivo: oculta cada vez más palabras de una línea de "Él".
export default function ProgressiveErase({ module, registerAnswer }) {
  return (
    <div className="erase-practice">
      <EraseRound words={module.words} registerAnswer={registerAnswer} />
    </div>
  );
}
