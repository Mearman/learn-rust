import { AlertTriangle } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    cheatCard,
    cheatTitle,
    navButton,
    referenceListGrid,
} from "../theme/styles.css.ts";
import { ERROR_CATALOGUE } from "../data/errors.ts";

interface ErrorCatalogueViewProps {
    readonly onOpenConcept: (conceptId: string) => void;
}

export function ErrorCatalogueView({ onOpenConcept }: ErrorCatalogueViewProps) {
    return (
        <div className={referenceListGrid}>
            {ERROR_CATALOGUE.map((entry) => (
                <article
                    key={entry.id}
                    id={`error-${entry.id}`}
                    className={cheatCard}
                    style={{
                        textAlign: "left",
                        width: "100%",
                    }}
                >
                    <h3
                        className={cheatTitle}
                        style={{ color: vars.colour.text, fontSize: "1rem" }}
                    >
                        <span
                            style={{
                                fontSize: "0.7rem",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "0.25rem",
                                background: vars.colour.accent,
                                color: vars.colour.panel,
                                fontWeight: 700,
                                marginRight: "0.5rem",
                                verticalAlign: "middle",
                            }}
                        >
                            {entry.code}
                        </span>
                        {entry.title}
                    </h3>
                    <p
                        style={{
                            margin: "0.25rem 0 0",
                            color: vars.colour.dim,
                            fontSize: "0.8rem",
                            fontFamily: "ui-monospace, monospace",
                        }}
                    >
                        {entry.message}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            marginTop: "0.75rem",
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    color: vars.colour.accentSoft,
                                    letterSpacing: "0.05em",
                                }}
                            >
                                What happened
                            </span>
                            <p
                                style={{
                                    margin: "0.2rem 0 0",
                                    lineHeight: 1.6,
                                    color: vars.colour.text,
                                    fontSize: "0.9rem",
                                }}
                            >
                                {entry.explanation}
                            </p>
                        </div>
                        <div>
                            <span
                                style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    color: vars.colour.accentSoft,
                                    letterSpacing: "0.05em",
                                }}
                            >
                                How to fix it
                            </span>
                            <p
                                style={{
                                    margin: "0.2rem 0 0",
                                    lineHeight: 1.6,
                                    color: vars.colour.text,
                                    fontSize: "0.9rem",
                                }}
                            >
                                {entry.fix}
                            </p>
                        </div>
                    </div>

                    {entry.conceptId !== undefined ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (entry.conceptId !== undefined)
                                    onOpenConcept(entry.conceptId);
                            }}
                            className={navButton}
                            style={{
                                width: "auto",
                                padding: "0.4rem 0.65rem",
                                marginTop: "0.5rem",
                            }}
                        >
                            <AlertTriangle size={12} /> Compare across languages
                        </button>
                    ) : null}
                </article>
            ))}
        </div>
    );
}
