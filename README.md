# Adjetivos en inglés — Flashcards

App en React + Vite para aprender los adjetivos en inglés de [instrucciones.md](instrucciones.md) con flashcards.

## Módulos

- **📖 Estudio**: flashcards que se voltean al hacer clic. Marca cada palabra como "Ya me la sé" o "Necesito repasar"; puedes filtrar para ver solo las pendientes. Tiene dos tipos, con el mismo switch que el examen:
  - 🌐 **Traducción**: inglés ↔ español.
  - 🇬🇧 **Solo inglés**: la palabra ↔ su definición en inglés, sin pasar por el español.
- **📝 Examen**: quiz de opción múltiple (15 preguntas) con retroalimentación inmediata y puntaje final. Tiene dos tipos, seleccionables con un switch arriba del examen:
  - 🌐 **Traducción**: inglés→español o español→inglés al azar.
  - 🇬🇧 **Solo inglés**: todo en inglés, sin pasar por el español — relaciona la palabra con su definición en inglés (dirección "palabra → definición" o "definición → palabra" al azar).
- **🔍 Identificar**: pega cualquier texto en inglés y haz clic en las palabras que creas que son adjetivos (cada clic la colorea). Al presionar "Revisar" se compara contra tu lista de práctica y, para lo que marcaste fuera de ella, contra un diccionario de referencia de ~1100 adjetivos comunes ([src/data/commonAdjectives.js](src/data/commonAdjectives.js)):
  - 🟢 verde = acierto (la marcaste y está en tu lista),
  - 🟠 ámbar = se te escapó (está en tu lista y no la marcaste),
  - 🔵 azul = la marcaste, no está en tu lista, pero sí parece un adjetivo real (incluye una comprobación simple de comparativo/superlativo: "faster", "biggest", etc.),
  - ⚪ gris = la marcaste y no se reconoce como adjetivo común (puede seguir siendo válida; el diccionario de referencia es una heurística, no un analizador gramatical).

  Los aciertos y los que se te escapan alimentan el mismo progreso que estudio y examen. Incluye 6 textos de ejemplo (mascota, restaurante, clima, persona, tecnología, ciudad) que entre todos cubren las 50 palabras de la lista.
- **📊 Progreso**: resumen de palabras nuevas / en progreso / dominadas, con lista filtrable ordenada por lo que más necesitas repasar, y opción de reiniciar el progreso.

Una palabra se marca como **dominada** al acertar 3 veces seguidas (en estudio o examen); un fallo reinicia su racha. El progreso se guarda automáticamente en `localStorage`, por lo que persiste entre sesiones en el mismo navegador.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run lint      # oxlint
```

## Estructura

```
src/
  data/adjectives.js      # las 50 palabras (inglés/español + definición en inglés)
  data/commonAdjectives.js # diccionario de referencia (~1100 adjetivos) para el modo Identificar
  data/sampleTexts.js     # 6 textos de ejemplo para el modo Identificar (cubren las 50 palabras)
  hooks/useProgress.js    # persistencia y cálculo de progreso (localStorage)
  utils/shuffle.js        # utilidad de mezcla aleatoria
  components/
    FlashCard.jsx
    StudyMode.jsx
    ExamMode.jsx
    IdentifyMode.jsx
    ProgressBoard.jsx
    Nav.jsx
```

Para agregar más palabras, edita el arreglo `RAW_ADJECTIVES` en `src/data/adjectives.js`.
