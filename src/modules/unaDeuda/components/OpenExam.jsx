import { useState } from 'react'
import { shuffle } from '../../../utils/shuffle'
import SpeakButton from '../../../components/SpeakButton'
import { getPrevious } from '../data/guion'
import { diffWords, isCorrect, similarity } from '../utils/compare'
import './OpenExam.css'

const MARKS = { ok: '', missing: '＋ ', wrong: '✗ ', extra: '− ' }
const LABELS = { ok: 'correcta', missing: 'falta', wrong: 'distinta', extra: 'sobra' }

// Examen abierto: dado el contexto previo, el usuario escribe de memoria la
// línea de "Él". Es correcto solo si coincide al 100% tras normalizar
// (mayúsculas, tildes y puntuación se ignoran).
export default function OpenExam({ module, registerAnswer }) {
  const words = module.words
  const [deck, setDeck] = useState(() => shuffle(words))
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (words.length === 0) return <p>No hay líneas disponibles.</p>

  const line = deck[index]
  const correct = checked && isCorrect(line.en, typed)
  const diff = checked ? diffWords(line.en, typed) : []
  const percent = checked ? similarity(line.en, typed) : 0
  const isLast = index === deck.length - 1

  const handleCheck = () => {
    if (checked || !typed.trim()) return
    const ok = isCorrect(line.en, typed)
    registerAnswer(line.id, ok)
    if (ok) setScore((s) => s + 1)
    setChecked(true)
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex(index + 1)
    setTyped('')
    setChecked(false)
  }

  const handleRetry = () => {
    setDeck(shuffle(words))
    setIndex(0)
    setTyped('')
    setChecked(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mode-panel ud-oe-panel">
        <div className="mode-header">
          <h2>Examen</h2>
        </div>
        <div className="ud-oe-card">
          <p className="ud-oe-score">
            Resultado: {score} de {deck.length} líneas correctas
          </p>
          <div className="ud-oe-actions">
            <button type="button" className="btn btn-primary" onClick={handleRetry}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mode-panel ud-oe-panel">
      <div className="mode-header">
        <h2>Examen</h2>
      </div>
      <div className="ud-oe-card">
        <p className="ud-oe-progress">
          Línea {index + 1} de {deck.length}
        </p>
        <p className="ud-oe-prompt-label">
          {getPrevious(line.id)?.personaje === 'el' ? 'Antes dijo Él:' : 'Ella dice:'}
        </p>
        <p className="ud-oe-prompt">{line.es || '(empezás vos)'}</p>
        <p className="ud-oe-prompt-label">Escribí de memoria lo que responde Él:</p>

        <textarea
          className="ud-oe-input"
          rows={3}
          value={typed}
          disabled={checked}
          placeholder="Escribí la línea de memoria..."
          aria-label="Línea de Él"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => setTyped(e.target.value)}
        />

        {!checked ? (
          <div className="ud-oe-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!typed.trim()}
              onClick={handleCheck}
            >
              Comprobar
            </button>
          </div>
        ) : (
          <div className="ud-oe-result" aria-live="polite">
            <p className={`ud-oe-verdict ${correct ? 'is-correct' : 'is-wrong'}`}>
              {correct ? '✓ ¡Correcto!' : '✗ Hay diferencias'}
            </p>
            <p className="ud-oe-similarity">Similitud con el original: {percent}%</p>
            {!correct && (
              <>
                <p className="ud-oe-diff" aria-label="Diferencias con la línea original">
                  {diff.map((t, i) => (
                    <span key={i} className={`ud-oe-token ud-oe-${t.type}`}>
                      <span className="ud-oe-mark" aria-hidden="true">
                        {MARKS[t.type]}
                      </span>
                      {t.text}
                      <span className="ud-oe-sr">{` (${LABELS[t.type]}${
                        t.type === 'wrong' && t.expected ? `, era ${t.expected}` : ''
                      })`}</span>
                    </span>
                  ))}
                </p>
                <p className="ud-oe-legend">
                  ＋ falta · ✗ distinta (subrayada) · − sobra (tachada)
                </p>
              </>
            )}
            <p className="ud-oe-correct">
              <strong>Línea original:</strong> {line.en}{' '}
              <SpeakButton text={line.en} lang="es-ES" />
            </p>
            <div className="ud-oe-actions">
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                {isLast ? 'Ver resultado' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
