// Utilidades puras de comparación de texto (sin dependencias de React).

export function normalize(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenize(texto) {
  const n = normalize(texto)
  return n ? n.split(' ') : []
}

// Diff por palabras basado en LCS. Devuelve tokens:
//   { type: 'ok',      text }
//   { type: 'missing', text }              (esperada, no escrita)
//   { type: 'extra',   text }              (escrita, no esperada)
//   { type: 'wrong',   text, expected }    (escrita distinta de la esperada)
export function diffWords(esperado, escrito) {
  const a = tokenize(esperado)
  const b = tokenize(escrito)
  const n = a.length
  const m = b.length

  const lcs = Array.from({ length: n + 1 }, () => Array.from({ length: m + 1 }, () => 0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const result = []
  let missing = []
  let extra = []
  const flush = () => {
    const pairs = Math.min(missing.length, extra.length)
    for (let k = 0; k < pairs; k++) {
      result.push({ type: 'wrong', text: extra[k], expected: missing[k] })
    }
    for (let k = pairs; k < missing.length; k++) result.push({ type: 'missing', text: missing[k] })
    for (let k = pairs; k < extra.length; k++) result.push({ type: 'extra', text: extra[k] })
    missing = []
    extra = []
  }

  let i = 0
  let j = 0
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      flush()
      result.push({ type: 'ok', text: a[i] })
      i++
      j++
    } else if (j >= m || (i < n && lcs[i + 1][j] >= lcs[i][j + 1])) {
      missing.push(a[i++])
    } else {
      extra.push(b[j++])
    }
  }
  flush()
  return result
}

// Porcentaje 0-100: palabras correctas sobre el máximo entre esperadas y escritas.
export function similarity(esperado, escrito) {
  const total = Math.max(tokenize(esperado).length, tokenize(escrito).length)
  if (total === 0) return 100
  const ok = diffWords(esperado, escrito).filter((t) => t.type === 'ok').length
  return Math.round((ok / total) * 100)
}

export function isCorrect(esperado, escrito) {
  return normalize(esperado) === normalize(escrito)
}
