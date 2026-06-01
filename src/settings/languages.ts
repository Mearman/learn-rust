// Re-export from the canonical source. Files that import from this module
// should be updated to import from data/languages.ts directly — this shim
// exists only so that files owned by other parallel agents still compile.
export { languageNameForId as languageFamiliarityLabel } from "../data/languages.ts";
