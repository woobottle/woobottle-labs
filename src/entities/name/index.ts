export type { NameData, Gender, Country, NameGenerationOptions, GeneratedName } from './model/types';
export { nameDatabase, getNamesByGender, getNamesByCountry, getRandomNames } from './lib/name-database';
export {
  validateName,
  combineNames,
  filterNamesByOptions,
  generateNameCombinations,
  getNameSuggestions,
  countSyllables
} from './lib/name-utils';
