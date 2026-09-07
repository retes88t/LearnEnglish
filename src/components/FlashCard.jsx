import SpeakButton from './SpeakButton';

export default function FlashCard({
  front,
  back,
  flipped,
  onFlip,
  badge,
  frontLabel = 'Inglés',
  backLabel = 'Español',
  frontLang = 'en-US',
  backLang = 'es-ES',
  dense = false,
}) {
  return (
    <div className="flashcard-wrapper" onClick={onFlip}>
      {badge && <span className={`badge badge-${badge.type}`}>{badge.label}</span>}
      <div className={`flashcard ${dense ? 'flashcard-dense' : ''} ${flipped ? 'is-flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-label">{frontLabel}</span>
          <p className={dense ? 'flashcard-text-dense' : ''}>{front}</p>
          <SpeakButton text={front} lang={frontLang} />
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-label">{backLabel}</span>
          <p className={dense ? 'flashcard-text-dense' : ''}>{back}</p>
          <SpeakButton text={back} lang={backLang} />
        </div>
      </div>
      <span className="flashcard-hint">Toca la tarjeta para voltearla</span>
    </div>
  );
}
