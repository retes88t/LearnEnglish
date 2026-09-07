import { canSpeak, speak } from '../utils/speak';

// Icono de bocina minimalista (trazo, sin relleno) en `currentColor`, para
// heredar el color de texto del botón que lo contiene (blanco en el frente
// de la flashcard, color de acento en el resto de los contextos).
function SpeakerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

// Botón reutilizable para leer un texto en voz alta con la Web Speech API
// nativa del navegador (sin librerías externas). No renderiza nada si el
// navegador no la soporta o si no hay texto que leer.
//
// `variant="icon"` (por defecto) es un botón circular pequeño, pensado para
// ir junto a una flashcard o un prompt de examen. `variant="button"` reusa
// los estilos `.btn .btn-ghost` del resto de la app, para usarlo junto a
// otros botones de texto (p. ej. en el modo Identificar).
export default function SpeakButton({ text, lang = 'en-US', label, variant = 'icon' }) {
  if (!canSpeak || !text) return null;

  const handleClick = (e) => {
    e.stopPropagation(); // evita disparar clicks del contenedor (p.ej. voltear la flashcard)
    speak(text, lang);
  };

  const title = label ?? `Escuchar "${text}"`;

  if (variant === 'button') {
    return (
      <button type="button" className="btn btn-ghost speak-btn-text" onClick={handleClick} title={title}>
        <SpeakerIcon /> Escuchar
      </button>
    );
  }

  return (
    <button type="button" className="speak-btn" onClick={handleClick} aria-label={title} title={title}>
      <SpeakerIcon />
    </button>
  );
}
