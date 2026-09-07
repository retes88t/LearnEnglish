// Lista de verbos irregulares en inglés: [base, español, pasado simple,
// participio pasado]. Cuando una forma tiene variantes (was / were,
// gotten / got) se listan separadas por " / ", igual que en la tabla de
// referencia.
//
// `forms` son todas las formas (base, pasado simple, participio pasado, ya
// separadas por variante) que el modo Identificar reconoce en un texto
// libre. Al igual que los linking verbs, los verbos irregulares son una
// clase cerrada: no hace falta una heurística de "parece verbo irregular",
// basta con la lista de formas.
import { slugify } from '../../../utils/slugify';

const RAW_IRREGULAR_VERBS = [
  ['be', 'ser / estar', 'was / were', 'been'],
  ['become', 'convertirse', 'became', 'become'],
  ['begin', 'comenzar', 'began', 'begun'],
  ['break', 'romper', 'broke', 'broken'],
  ['bring', 'traer', 'brought', 'brought'],
  ['build', 'construir', 'built', 'built'],
  ['buy', 'comprar', 'bought', 'bought'],
  ['catch', 'atrapar', 'caught', 'caught'],
  ['choose', 'elegir', 'chose', 'chosen'],
  ['come', 'venir', 'came', 'come'],
  ['cost', 'costar', 'cost', 'cost'],
  ['cut', 'cortar', 'cut', 'cut'],
  ['do', 'hacer', 'did', 'done'],
  ['draw', 'dibujar', 'drew', 'drawn'],
  ['drink', 'beber', 'drank', 'drunk'],
  ['drive', 'conducir', 'drove', 'driven'],
  ['eat', 'comer', 'ate', 'eaten'],
  ['fall', 'caer', 'fell', 'fallen'],
  ['feel', 'sentir', 'felt', 'felt'],
  ['find', 'encontrar', 'found', 'found'],
  ['fly', 'volar', 'flew', 'flown'],
  ['forget', 'olvidar', 'forgot', 'forgotten'],
  ['get', 'obtener / conseguir', 'got', 'gotten / got'],
  ['give', 'dar', 'gave', 'given'],
  ['go', 'ir', 'went', 'gone'],
  ['grow', 'crecer', 'grew', 'grown'],
  ['have', 'tener', 'had', 'had'],
  ['hear', 'escuchar / oír', 'heard', 'heard'],
  ['hold', 'sostener', 'held', 'held'],
  ['keep', 'mantener / guardar', 'kept', 'kept'],
  ['know', 'saber / conocer', 'knew', 'known'],
  ['leave', 'dejar / salir', 'left', 'left'],
  ['lose', 'perder', 'lost', 'lost'],
  ['make', 'hacer / fabricar', 'made', 'made'],
  ['meet', 'conocer / reunirse', 'met', 'met'],
  ['pay', 'pagar', 'paid', 'paid'],
  ['put', 'poner', 'put', 'put'],
  ['read', 'leer', 'read', 'read'],
  ['run', 'correr', 'ran', 'run'],
  ['say', 'decir', 'said', 'said'],
  ['see', 'ver', 'saw', 'seen'],
  ['sell', 'vender', 'sold', 'sold'],
  ['send', 'enviar', 'sent', 'sent'],
  ['sing', 'cantar', 'sang', 'sung'],
  ['sit', 'sentarse', 'sat', 'sat'],
  ['sleep', 'dormir', 'slept', 'slept'],
  ['speak', 'hablar', 'spoke', 'spoken'],
  ['spend', 'gastar / pasar tiempo', 'spent', 'spent'],
  ['stand', 'estar de pie', 'stood', 'stood'],
  ['swim', 'nadar', 'swam', 'swum'],
  ['take', 'tomar / llevar', 'took', 'taken'],
  ['teach', 'enseñar', 'taught', 'taught'],
  ['tell', 'decir / contar', 'told', 'told'],
  ['think', 'pensar', 'thought', 'thought'],
  ['understand', 'entender', 'understood', 'understood'],
  ['wear', 'llevar puesto', 'wore', 'worn'],
  ['win', 'ganar', 'won', 'won'],
  ['write', 'escribir', 'wrote', 'written'],
];

// Separa las variantes "a / b" en formas individuales en minúscula.
const splitForms = (raw) => raw.split('/').map((form) => form.trim().toLowerCase());

export const words = RAW_IRREGULAR_VERBS.map(([en, es, pastSimple, pastParticiple]) => ({
  id: slugify(en),
  en,
  es,
  enDef: `Past simple: ${pastSimple} · Past participle: ${pastParticiple}`,
  pastSimple,
  pastParticiple,
  forms: [en, ...splitForms(pastSimple), ...splitForms(pastParticiple)],
}));
