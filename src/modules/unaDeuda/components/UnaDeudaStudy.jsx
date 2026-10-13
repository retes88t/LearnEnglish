import SpeakButton from '../../../components/SpeakButton';
import { LINES } from '../data/guion';
import './UnaDeudaStudy.css';

// Pestaña Estudio: muestra el guion completo en orden. Las líneas de "Ella"
// van atenuadas (contexto) y las de "Él" resaltadas (las que hay que
// aprender). Solo lectura: no registra progreso. Cada línea se puede
// escuchar en español.
export default function UnaDeudaStudy() {
  return (
    <section className="mode-panel una-deuda-study">
      <header className="mode-header">
        <h2>Modo estudio: el guion</h2>
        <p>Leé el diálogo completo. Las líneas de Él son las que tenés que aprender.</p>
      </header>

      <ol className="ud-script">
        {LINES.map((line) => (
          <li key={line.id} className={`ud-line ud-${line.personaje}`}>
            <div className="ud-line-body">
              <span className="ud-speaker">{line.personaje === 'el' ? 'Él' : 'Ella'}</span>
              <p className="ud-text">{line.texto}</p>
            </div>
            <SpeakButton text={line.texto} lang="es-ES" />
          </li>
        ))}
      </ol>
    </section>
  );
}
