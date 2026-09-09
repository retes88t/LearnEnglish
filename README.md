# Aprender inglés — Flashcards

Una app web gratuita para practicar vocabulario y gramática del inglés, pensada para cualquier persona que quiera repasar inglés de forma simple y ordenada — desde estudiantes hasta quien solo quiere reforzar palabras y reglas puntuales.

## 🎯 ¿Qué puedes hacer con esta app?

La práctica está organizada en **módulos** (por ejemplo, adjetivos, verbos de enlace, verbos irregulares...). Cada módulo te deja:

- **📖 Estudiar con flashcards**: tarjetas que se dan vuelta al hacer clic, mostrando la traducción o la definición según el caso. Marcas cada una como "Ya me la sé" o "Necesito repasar".
- **📝 Presentar un examen**: un quiz de opción múltiple con corrección inmediata y un puntaje final, para ver cuánto retuviste.
- **🔍 Identificar palabras en un texto**: pegas cualquier texto en inglés y haces clic en las palabras que creas que pertenecen a la categoría que estás practicando (por ejemplo, los adjetivos). La app te dice qué acertaste y qué se te escapó.
- **📊 Ver tu progreso**: un resumen de qué palabras son nuevas, cuáles estás repasando y cuáles ya dominas, para saber en qué enfocarte.

Tu progreso se guarda automáticamente en el navegador, así que puedes cerrar la app y retomar más tarde sin perder nada.

## 🚀 Cómo empezar a usarla

No hace falta instalar nada ni crear una cuenta: entra a la app desde el navegador, elige un módulo desde las pestañas de arriba y empieza a practicar. Si eres la persona que la mantiene o quieres correrla en tu computadora, mira la sección técnica más abajo.

---

## Detalle técnico de los módulos

App en React + Vite para practicar vocabulario y gramática del inglés con flashcards, quizzes y ejercicios de identificación en texto. Está organizada en **módulos** independientes; cada uno tiene su propio banco de palabras y su propio progreso.

### Módulos

- **🧠 Adjetivos**: los adjetivos comunes en inglés.
- **🔗 Linking Verbs**: los verbos de enlace (am, is, was, become, get...).
- **⏳ Irregular Verbs**: verbos irregulares (base / pasado simple / participio pasado).
- **🔥 Extreme Adjectives**: adjetivos extremos (no graduables), como "huge" o "furious".
- **⏱️ Present & Past Simple**: el verbo *to be*, los auxiliares *do/does/did* y las reglas de ortografía de la 3ª persona.

Casi todos los módulos comparten las mismas 4 pestañas:

- **📖 Estudio**: flashcards que se voltean al hacer clic. Marca cada palabra como "Ya me la sé" o "Necesito repasar"; puedes filtrar para ver solo las pendientes. Tiene dos tipos, con el mismo switch que el examen:
  - 🌐 **Traducción**: inglés ↔ español (donde aplique).
  - 🇬🇧 **Solo inglés**: la palabra ↔ su definición/ejemplo en inglés, sin pasar por el español.
- **📝 Examen**: quiz de opción múltiple con retroalimentación inmediata y puntaje final. Mismos dos tipos que Estudio.
- **🔍 Identificar**: pega cualquier texto en inglés y haz clic en las palabras que creas que pertenecen a la categoría del módulo (cada clic la colorea). Al presionar "Revisar" se compara contra tu lista de práctica y, para lo que marcaste fuera de ella, contra un diccionario de referencia (cuando el módulo lo tiene):
  - 🟢 verde = acierto (la marcaste y está en tu lista),
  - 🟠 ámbar = se te escapó (está en tu lista y no la marcaste),
  - 🔵 azul = la marcaste, no está en tu lista, pero sí parece válida según el diccionario de referencia,
  - ⚪ gris = la marcaste y no se reconoce (puede seguir siendo válida; el diccionario de referencia es una heurística, no un analizador gramatical).

  Los aciertos y los que se te escapan alimentan el mismo progreso que Estudio y Examen. Cada módulo incluye varios textos de ejemplo para practicar.
- **📊 Progreso**: resumen de palabras nuevas / en progreso / dominadas, con lista filtrable ordenada por lo que más necesitas repasar, y opción de reiniciar el progreso.

El módulo **⏱️ Present & Past Simple** reemplaza "Identificar" por **🔤 Reglas** (práctica de ortografía de la 3ª persona), ya que no es una tarea de identificar palabras en texto.

Una palabra se marca como **dominada** al acertar 3 veces seguidas (en Estudio o Examen); un fallo reinicia su racha. El progreso de cada módulo se guarda por separado en `localStorage`, por lo que persiste entre sesiones en el mismo navegador.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en docs/ (servido por GitHub Pages)
npm run lint      # oxlint
```

## Estructura

```
src/
  modules/
    index.js               # registro central: qué módulos existen
    adjectives/
      index.js              # config del módulo (labels, identify, storageKey...)
      data/                 # palabras, diccionario de referencia, textos de ejemplo
    linkingVerbs/
    irregularVerbs/
    extremeAdjectives/
    presentPastSimple/      # módulo con pestañas y componentes propios
  components/                # Nav, StudyMode, ExamMode, IdentifyMode, ProgressBoard...
  hooks/useProgress.js        # persistencia y cálculo de progreso (localStorage)
  utils/                      # shuffle, slugify, speak
```

Para agregar un módulo nuevo, crea su carpeta en `src/modules/<nombre>/` (siguiendo la forma de `adjectives` o `linkingVerbs`) y regístralo en `src/modules/index.js`. Para agregar palabras a un módulo existente, edita su archivo de datos en `src/modules/<nombre>/data/`.
