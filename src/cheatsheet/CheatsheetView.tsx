import { ArrowLeftRight } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import { cheatsGrid, cheatCard, cheatTitle, navButton, noteBlock } from "../theme/styles.css.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { LANGUAGE_CONCEPTS } from "../data/language-concepts.ts";

interface CheatsheetViewProps {
    readonly onOpenReferences: () => void;
    readonly onOpenConcept: (conceptId: string) => void;
}

export function CheatsheetView({ onOpenReferences, onOpenConcept }: CheatsheetViewProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className={noteBlock}>
                <span>
                    Quick-reference summaries. The Compare tab has the full cross-language details.
                </span>
                <button
                    type="button"
                    onClick={onOpenReferences}
                    className={navButton}
                    style={{ width: "auto", padding: "0.5rem 0.75rem" }}
                >
                    Open comparisons
                </button>
            </div>
            <div className={cheatsGrid}>
                {CONCEPTS.map((concept) => {
                    const rustEntry = LANGUAGE_CONCEPTS.find(
                        (lc) => lc.languageId === "rust" && lc.conceptId === concept.id,
                    );
                    return (
                        <div key={concept.id} className={cheatCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <h3 className={cheatTitle}>{concept.title}</h3>
                                <button
                                    type="button"
                                    onClick={() => onOpenConcept(concept.id)}
                                    className={navButton}
                                    style={{ width: "auto", padding: "0.3rem 0.5rem", fontSize: "0.75rem" }}
                                >
                                    <ArrowLeftRight size={12} /> Compare
                                </button>
                            </div>
                            <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", lineHeight: 1.5, color: vars.colour.dim }}>
                                {concept.description}
                            </p>
                            {rustEntry !== undefined ? (
                                <pre style={{
                                    margin: 0,
                                    padding: "0.5rem",
                                    borderRadius: "0.375rem",
                                    background: vars.colour.codeBackground,
                                    color: vars.colour.text,
                                    fontFamily: "ui-monospace, monospace",
                                    fontSize: "0.8rem",
                                    lineHeight: 1.5,
                                    overflow: "auto",
                                    whiteSpace: "pre-wrap",
                                }}>
                                    {rustEntry.code}
                                </pre>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
