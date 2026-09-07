import { useMemo, useState } from 'react';
import SpeakButton from './SpeakButton';

// Cualquier secuencia de letras (con acentos) es una "palabra"; el resto
// (espacios, puntuación, saltos de línea) se conserva tal cual para poder
// reconstruir el texto original al pintarlo.
const WORD_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:'[A-Za-zÀ-ÖØ-öø-ÿ]+)?/g;

function tokenize(text) {
  const tokens = [];
  let lastIndex = 0;
  let match;
  WORD_REGEX.lastIndex = 0;
  // eslint-disable-next-line no-cond-assign
  while ((match = WORD_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'sep', value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ type: 'word', value: match[0] });
    lastIndex = WORD_REGEX.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: 'sep', value: text.slice(lastIndex) });
  }
  return tokens.map((token, index) => ({ ...token, key: index }));
}

// Índice para buscar rápido si una palabra pertenece a la lista de práctica.
// Cada entrada puede declarar `forms` (formas conjugadas que también deben
// contar, p. ej. "is"/"was" -> "be"); si no las declara, solo cuenta la
// palabra tal cual está escrita en `en`.
function buildWordIndex(words) {
  const map = new Map();
  words.forEach((word) => {
    const forms = word.forms ?? [word.en];
    forms.forEach((form) => map.set(form.toLowerCase(), word));
  });
  return map;
}

export default function IdentifyMode({ module, registerAnswer }) {
  const { words, identify } = module;
  const wordIndex = useMemo(() => buildWordIndex(words), [words]);
  const hasExtraHeuristic = typeof identify.looksLikeExtra === 'function';
  const looksLikeExtra = identify.looksLikeExtra ?? (() => false);

  const [text, setText] = useState('');
  const [tokens, setTokens] = useState(null);
  const [marked, setMarked] = useState(() => new Set());
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = (source) => {
    const value = source ?? text;
    if (!value.trim()) return;
    setText(value);
    setTokens(tokenize(value));
    setMarked(new Set());
    setChecked(false);
    setResult(null);
  };

  const toggleWord = (key) => {
    if (checked) {
      setChecked(false);
      setResult(null);
    }
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const review = () => {
    // Agrupa por palabra única de la lista: si el usuario marcó al menos una
    // aparición, cuenta como acierto; si no marcó ninguna, cuenta como fallo.
    const found = new Map(); // id -> { word, markedAny }
    tokens.forEach((token) => {
      if (token.type !== 'word') return;
      const known = wordIndex.get(token.value.toLowerCase());
      if (!known) return;
      const entry = found.get(known.id) ?? { word: known, markedAny: false };
      if (marked.has(token.key)) entry.markedAny = true;
      found.set(known.id, entry);
    });

    let hits = 0;
    found.forEach(({ word, markedAny }) => {
      registerAnswer(word.id, markedAny);
      if (markedAny) hits += 1;
    });

    const outsideList = [...marked]
      .map((key) => tokens[key])
      .filter((token) => token?.type === 'word' && !wordIndex.has(token.value.toLowerCase()));
    const validOutside = outsideList.filter((token) => looksLikeExtra(token.value)).length;
    const unknownOutside = outsideList.length - validOutside;

    setResult({ hits, total: found.size, validOutside, unknownOutside });
    setChecked(true);
  };

  const startOver = () => {
    setTokens(null);
    setMarked(new Set());
    setChecked(false);
    setResult(null);
  };

  if (!tokens) {
    return (
      <section className="mode-panel">
        <header className="mode-header">
          <h2>{identify.title}</h2>
          <p>{identify.instructions}</p>
        </header>

        <textarea
          className="identify-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega aquí un párrafo, una noticia, la letra de una canción..."
          rows={6}
        />

        <div className="action-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => analyze()}
            disabled={!text.trim()}
          >
            🔍 Analizar texto
          </button>
          <SpeakButton text={text} lang="en-US" label="Escuchar texto" variant="button" />
        </div>

        <div className="sample-section">
          <p className="sample-label">O elige un ejemplo:</p>
          <div className="sample-chips">
            {identify.sampleTexts.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className="btn btn-ghost sample-chip"
                onClick={() => analyze(sample.text)}
              >
                {sample.emoji} {sample.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mode-panel">
      <header className="mode-header">
        <h2>{identify.title}</h2>
        <div className="identify-header-row">
          <p>{identify.shortInstructions}</p>
          <SpeakButton text={text} lang="en-US" label="Escuchar texto completo" />
        </div>
      </header>

      <div className="identify-text">
        {tokens.map((token) => {
          if (token.type === 'sep') {
            return <span key={token.key}>{token.value}</span>;
          }
          const isKnown = wordIndex.has(token.value.toLowerCase());
          const isMarked = marked.has(token.key);
          let cls = 'identify-word';
          if (checked) {
            if (isMarked && isKnown) cls += ' word-hit';
            else if (isMarked && !isKnown) {
              cls += looksLikeExtra(token.value) ? ' word-extra-valid' : ' word-extra-unknown';
            } else if (!isMarked && isKnown) cls += ' word-missed';
          } else if (isMarked) {
            cls += ' word-marked';
          }
          return (
            <span key={token.key} className={cls} onClick={() => toggleWord(token.key)}>
              {token.value}
            </span>
          );
        })}
      </div>

      {checked && (
        <div className="legend">
          <span className="legend-item"><i className="legend-dot dot-hit" /> Acierto (está en tu lista)</span>
          <span className="legend-item"><i className="legend-dot dot-missed" /> Se te escapó</span>
          {hasExtraHeuristic && (
            <span className="legend-item">
              <i className="legend-dot dot-extra-valid" /> Parece {identify.nounSingular} (fuera de tu lista)
            </span>
          )}
          <span className="legend-item">
            <i className="legend-dot dot-extra-unknown" /> No se reconoce como {identify.nounSingular}
          </span>
        </div>
      )}

      {result && (
        <p className="identify-result">
          Encontraste {result.hits} de {result.total} {identify.nounPlural} de tu lista.
          {result.validOutside > 0 && (
            <> Marcaste {result.validOutside} palabra{result.validOutside === 1 ? '' : 's'} más
              {' '}que parece{result.validOutside === 1 ? '' : 'n'} ser {identify.nounSingular}{result.validOutside === 1 ? '' : 's'} válido{result.validOutside === 1 ? '' : 's'}, aunque no
              {' '}está{result.validOutside === 1 ? '' : 'n'} en tu lista.</>
          )}
          {result.unknownOutside > 0 && hasExtraHeuristic && (
            <> {result.unknownOutside} palabra{result.unknownOutside === 1 ? '' : 's'} marcada{result.unknownOutside === 1 ? '' : 's'} no
              {' '}se reconoce{result.unknownOutside === 1 ? '' : 'n'} como {identify.nounSingular} común: revísala{result.unknownOutside === 1 ? '' : 's'}
              {' '}({identify.unknownOutsideHint}).</>
          )}
          {result.unknownOutside > 0 && !hasExtraHeuristic && (
            <> {result.unknownOutside} palabra{result.unknownOutside === 1 ? '' : 's'} marcada{result.unknownOutside === 1 ? '' : 's'} no
              {' '}{result.unknownOutside === 1 ? 'es' : 'son'} {identify.nounPlural}.</>
          )}
        </p>
      )}

      <div className="action-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={review}
          disabled={marked.size === 0}
        >
          ✅ Revisar
        </button>
        <button type="button" className="btn btn-ghost" onClick={startOver}>
          🔄 Nuevo texto
        </button>
      </div>
    </section>
  );
}
