import type { Challenge } from "./challenges.ts";
import type { LanguageFamiliarity } from "../data/languages.ts";
import { languageNameForId } from "../data/languages.ts";
import {
    perLanguageNotes,
    perLanguageList,
    perLanguageNote,
    perLanguageLead,
} from "./challenge.css.ts";

interface PerLanguageNotesProps {
    readonly challenge: Challenge;
    readonly familiarities: readonly LanguageFamiliarity[];
}

/** Per-language explanatory notes shown beneath a revealed explanation: for
 *  each language the reader knows, the challenge's `whyPerLanguage` entry (when
 *  present) phrased as a contrast against Rust. Renders nothing when there is no
 *  matching note. */
export function PerLanguageNotes({
    challenge,
    familiarities,
}: PerLanguageNotesProps) {
    const notes = familiarities
        .map((familiarity) => ({
            familiarity,
            explanation: challenge.whyPerLanguage?.[familiarity],
        }))
        .filter(
            (
                note
            ): note is {
                readonly familiarity: LanguageFamiliarity;
                readonly explanation: string;
            } => note.explanation !== undefined
        );
    if (notes.length === 0) return null;
    return (
        <div className={perLanguageNotes}>
            <div className={perLanguageList}>
                {notes.map((note) => (
                    <p key={note.familiarity} className={perLanguageNote}>
                        <span className={perLanguageLead}>
                            If you&apos;re familiar with{" "}
                            {languageNameForId(note.familiarity)}:{" "}
                        </span>
                        {note.explanation}
                    </p>
                ))}
            </div>
        </div>
    );
}
