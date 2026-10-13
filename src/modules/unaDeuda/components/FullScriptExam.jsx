import { useState } from 'react'
import SpeakButton from '../../../components/SpeakButton'
import { LINES } from '../data/guion'
import { diffWords, isCorrect, similarity } from '../utils/compare'
import './OpenExam.css'
import './FullScriptExam.css'

const MARKS = { ok: '', missing: '＋ ', wrong: '✗ ', extra: '− ' }
const LABELS = { ok: 'correcta', missing: 'falta', wrong: 'distinta', extra: 'sobra' }
const SPEAKER = { el: 'Él', ella: 'Ella' }

// Examen del guion completo: recorre todas las líneas en orden. Las de "Ella"
// se muestran como contexto; en cada línea de "Él" el usuario la escribe de
// memoria y se corrige igual que en el examen abierto.
export default function FullScriptExam({ registerAnswer }) {
  const [position, setPosition] = useState(0)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  // Resultados por id de línea de "Él": { typed, percent, ok }
  const [results, setResults] = useState({})

  const elLines = LINES.filter((l) => l.personaje === 'el')
  // Avanza hasta la próxima línea de "Él" (las de "Ella" se muestran solas).
  let current = position
  while (current < LINES.length && LINES[current].personaje !== 'el') current++
  const finished = current >= LINES.length
  const transcript = LINES.slice(0, finished ? LINES.length : current)
  const line = finished ? null : LINES[current]
  const answeredCount = Object.keys(results).length

  const handleCheck = () => {
    if (checked || !typed.trim()) return
    const ok = isCorrect(line.texto, typed)
    registerAnswer(line.id, ok)
    setResults((r) => ({ ...r, [line.id]: { typed, ok, percent: similarity(line.texto, typed) } }))
    setChecked(true)
  }

  const handleNext = () => {
    setPosition(current + 1)
    setTyped('')
    setChecked(false)
  }

  const handleRetry = () => {
    setPosition(0)
    setTyped('')
    setChecked(false)
    setResults({})
  }

  const renderTranscript = () => (
    <ol className="ud-fs-transcript">
      {transcript.map((l) => (
        <li key={l.id} className={`ud-fs-line ud-fs-${l.personaje}`}>
          <span className="ud-fs-speaker">{SPEAKER[l.personaje]}:</span> {l.texto}
          {results[l.id] && (
            <span className={`ud-fs-badge ${results[l.id].ok ? 'is-correct' : 'is-wrong'}`}>
              {results[l.id].percent}%
            </span>
          )}
        </li>
      ))}
    </ol>
  )

  if (finished) {
    const values = elLines.map((l) => results[l.id]).filter(Boolean)
    const correctCount = values.filter((v) => v.ok).length
    const average = values.length
      ? Math.round(values.reduce((sum, v) => sum + v.percent, 0) / values.length)
      : 0
    return (
      <div className="mode-panel ud-oe-panel">
        <div className="mode-header">
          <h2>Guion completo</h2>
        </div>
        <div className="ud-oe-card">
          <p className="ud-oe-score">
            Resultado: {correctCount} de {elLines.length} líneas correctas
          </p>
          <p className="ud-oe-similarity">Similitud promedio con el guion: {average}%</p>
          {renderTranscript()}
          <div className="ud-oe-actions">
            <button type="button" className="btn btn-primary" onClick={handleRetry}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const correct = checked && isCorrect(line.texto, typed)
  const diff = checked ? diffWords(line.texto, typed) : []
  const percent = checked ? results[line.id]?.percent ?? 0 : 0

  return (
    <div className="mode-panel ud-oe-panel">
      <div className="mode-header">
        <h2>Guion completo</h2>
      </div>
      <div className="ud-oe-card">
        <p className="ud-oe-progress">
          Línea de Él {answeredCount + (checked ? 0 : 1)} de {elLines.length}
        </p>
        {transcript.length > 0 ? renderTranscript() : (
          <p className="ud-oe-prompt-label">(empezás vos)</p>
        )}
        <p className="ud-oe-prompt-label">Escribí de memoria lo que dice Él:</p>

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
              <strong>Línea original:</strong> {line.texto}{' '}
              <SpeakButton text={line.texto} lang="es-ES" />
            </p>
            <div className="ud-oe-actions">
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
