// Registro central de módulos de práctica. Agregar un módulo nuevo consiste
// en crear su carpeta (datos + config en `index.js`) y añadirlo a esta lista;
// el resto de la app (Nav, StudyMode, ExamMode, IdentifyMode, ProgressBoard,
// useProgress) es genérico y funciona con cualquier módulo que respete la
// forma descrita en cada módulo.
import { adjectivesModule } from './adjectives';
import { linkingVerbsModule } from './linkingVerbs';
import { irregularVerbsModule } from './irregularVerbs';
import { extremeAdjectivesModule } from './extremeAdjectives';
import { accessoriesModule } from './accessories';
import { patternsMaterialsModule } from './patternsMaterials';
import { presentPastSimpleModule } from './presentPastSimple';
import { phrasesModule } from './phrases';
import { unaDeudaModule } from './unaDeuda';

export const MODULES = [
  adjectivesModule,
  linkingVerbsModule,
  irregularVerbsModule,
  extremeAdjectivesModule,
  accessoriesModule,
  patternsMaterialsModule,
  presentPastSimpleModule,
  phrasesModule,
  unaDeudaModule,
];
