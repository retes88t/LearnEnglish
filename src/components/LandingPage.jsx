import './LandingPage.css';

// Pantalla de bienvenida de la app. Puramente presentacional: no conoce
// módulos ni progreso, solo copy estático inspirado en README.md/context.md.
// Se activa con un botón que dispara `onStart` (App.jsx decide qué pasa después).
const FEATURES = [
  {
    icon: '📖',
    title: 'Estudio',
    description:
      'Flashcards que se voltean con un clic. Marca cada palabra como "Ya me la sé" o "Necesito repasar" a tu ritmo.',
  },
  {
    icon: '📝',
    title: 'Examen',
    description:
      'Quiz de opción múltiple con corrección inmediata y un puntaje final para ver cuánto sabes.',
  },
  {
    icon: '🔍',
    title: 'Identificar',
    description:
      'Pega un texto en inglés y marca las palabras de la categoría que estás practicando. La app te dice qué acertaste y qué se te escapó.',
  },
  {
    icon: '📊',
    title: 'Progreso',
    description:
      'Un resumen de qué palabras son nuevas, cuáles estás aprendiendo y cuáles ya dominas, guardado automáticamente en tu navegador.',
  },
];

const STEPS = [
  {
    number: '1',
    title: 'Elige un módulo',
    description: 'Adjetivos, verbos irregulares, verbos de enlace y más, cada uno con su propio progreso.',
  },
  {
    number: '2',
    title: 'Practica a tu ritmo',
    description: 'Flashcards, examen o identificación de palabras en texto: tú eliges cómo repasar.',
  },
  {
    number: '3',
    title: 'Sigue tu progreso',
    description: 'Cada acierto y cada falla se guardan solos, sin registrarte ni instalar nada.',
  },
];

export default function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">🧠 Aprender Inglés</span>
          <div className="landing-nav-links">
            <a href="#how-it-works">Cómo funciona</a>
            <a href="#features">Funciones</a>
          </div>
          <button type="button" className="btn btn-primary landing-nav-cta" onClick={onStart}>
            Empezar
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <p className="landing-kicker">🧠 Aprende inglés</p>
            <h1>
              Practica vocabulario y gramática de inglés{' '}
              <span className="landing-highlight">a tu manera</span>
            </h1>
            <p className="landing-subtitle">
              Una app pensada para estudiar de forma simple: eliges un tema, practicas con
              flashcards y ejercicios cortos, y vas viendo tu progreso. Sin registro, sin
              complicaciones: solo abres la app y empiezas.
            </p>
            <div className="landing-hero-actions">
              <button type="button" className="btn btn-primary landing-cta" onClick={onStart}>
                🚀 Empezar a practicar
              </button>
              <a href="#features" className="btn btn-ghost landing-cta-secondary">
                Ver funciones
              </a>
            </div>
          </div>

          <div className="landing-hero-visual" aria-hidden="true">
            <span className="landing-decor landing-decor-1" />
            <span className="landing-decor landing-decor-2" />
            <div className="landing-mockup">
              <div className="landing-mockup-bar">
                <span className="landing-mockup-dot" />
                <span className="landing-mockup-dot" />
                <span className="landing-mockup-dot" />
              </div>
              <div className="landing-mockup-tabs">
                <span className="landing-mockup-tab is-active">Estudio</span>
                <span className="landing-mockup-tab">Examen</span>
                <span className="landing-mockup-tab">Progreso</span>
              </div>
              <div className="landing-mockup-card">
                <span className="landing-mockup-card-label">Adjetivo</span>
                <p className="landing-mockup-card-word">happy</p>
                <span className="landing-mockup-card-hint">Toca la tarjeta para ver la traducción</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-steps">
        <h2>Cómo funciona</h2>
        <div className="landing-steps-grid">
          {STEPS.map((step) => (
            <article className="landing-step-card" key={step.number}>
              <span className="landing-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="landing-features">
        <h2>¿Qué puedes hacer?</h2>
        <div className="landing-features-grid">
          {FEATURES.map((feature) => (
            <article className="landing-feature-card" key={feature.title}>
              <span className="landing-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-final-cta">
        <h2>¿Listo para empezar?</h2>
        <p>No necesitas cuenta ni instalar nada: se guarda solo en tu navegador.</p>
        <button type="button" className="btn btn-primary landing-cta" onClick={onStart}>
          🚀 Empezar a practicar
        </button>
      </section>
    </div>
  );
}
