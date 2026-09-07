// Lista de linking verbs (verbos de enlace) en inglés. Muchos comparten una
// traducción "cruda" al español (get/turn -> ponerse; appear/seem ->
// parecer; stay/keep -> mantenerse), así que la traducción de cada uno
// incluye un matiz entre paréntesis (sentido, registro o tipo de cambio)
// para que sea identificable por sí sola y no solo por el verbo en inglés.
// El ejemplo en inglés (usado como "definición" en el examen y estudio
// "solo en inglés") sigue siendo la referencia principal para el matiz.
//
// `forms` son las formas conjugadas que el modo Identificar reconoce en un
// texto libre (am/is/are/was/were/... todas cuentan como "be", got/gotten
// cuentan como "get", etc.). A diferencia de los adjetivos, los linking
// verbs son una clase cerrada: no hace falta una heurística de "parece
// verbo de enlace", basta con la lista de formas.
import { slugify } from '../../../utils/slugify';

const RAW_LINKING_VERBS = [
  ['be', 'ser / estar', 'She is happy.', ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being']],
  ['appear', 'parecer (por su aspecto)', 'He appears nervous.', ['appear', 'appears', 'appeared', 'appearing']],
  ['seem', 'parecer (por impresión)', 'You seem tired.', ['seem', 'seems', 'seemed', 'seeming']],
  ['look', 'verse / parecer (visualmente)', 'You look great.', ['look', 'looks', 'looked', 'looking']],
  ['feel', 'sentirse (física o emocionalmente)', 'I feel good.', ['feel', 'feels', 'felt', 'feeling']],
  ['sound', 'sonar / parecer (al oído)', 'That sounds interesting.', ['sound', 'sounds', 'sounded', 'sounding']],
  ['smell', 'oler (al olfato)', 'It smells delicious.', ['smell', 'smells', 'smelled', 'smelt', 'smelling']],
  ['taste', 'saber (al gusto)', 'It tastes sweet.', ['taste', 'tastes', 'tasted', 'tasting']],
  ['become', 'convertirse / volverse (cambio marcado)', 'He became famous.', ['become', 'becomes', 'became', 'becoming']],
  ['get', 'ponerse (cambio informal)', 'She got angry.', ['get', 'gets', 'got', 'gotten', 'getting']],
  ['grow', 'volverse poco a poco (cambio gradual)', 'He grew impatient.', ['grow', 'grows', 'grew', 'grown', 'growing']],
  ['turn', 'tornarse / ponerse (cambio repentino)', 'The sky turned dark.', ['turn', 'turns', 'turned', 'turning']],
  ['go', 'volverse (cambio negativo)', 'The milk went bad.', ['go', 'goes', 'went', 'gone', 'going']],
  ['come', 'resultar (desenlace positivo)', 'The dream came true.', ['come', 'comes', 'came', 'coming']],
  ['fall', 'caer en un estado (ej. dormirse)', 'He fell asleep.', ['fall', 'falls', 'fell', 'fallen', 'falling']],
  ['remain', 'permanecer (formal, sin esfuerzo)', 'She remained calm.', ['remain', 'remains', 'remained', 'remaining']],
  ['stay', 'quedarse (informal)', 'Stay quiet.', ['stay', 'stays', 'stayed', 'staying']],
  ['keep', 'mantenerse (con esfuerzo continuo)', 'Keep calm.', ['keep', 'keeps', 'kept', 'keeping']],
  ['prove', 'resultar ser (tras comprobarlo)', 'The theory proved correct.', ['prove', 'proves', 'proved', 'proven', 'proving']],
];

export const words = RAW_LINKING_VERBS.map(([en, es, enDef, forms]) => ({
  id: slugify(en),
  en,
  es,
  enDef,
  forms,
}));
