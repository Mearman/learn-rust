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
    readonly active: string;
    readonly onSelect: (id: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
}

export function ErrorCatalogueView({
    active,
    onSelect,
    onOpenConcept,
}: ErrorCatalogueViewProps) {
    const entry = ERROR_CATALOGUE.find((e) => e.id === active);
    if (entry === undefined) {
        throw new Error(`Unknown error entry: ${active}`);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            {/* Detail panel for the active error */}
            <div className={cheatCard}>
                <h3
                    className={cheatTitle}
                    style={{ color: vars.colour.text, fontSize: "1.1rem" }}
                >
                    <span
                        style={{
                            fontSize: "0.75rem",
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
                        margin: 0,
                        color: vars.colour.dim,
                        fontSize: "0.85rem",
                        fontFamily: "ui-monospace, monospace",
                    }}
                >
                    {entry.message}
                </p>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: "0.7rem",
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
                                margin: "0.25rem 0 0",
                                lineHeight: 1.7,
                                color: vars.colour.text,
                                fontSize: "0.95rem",
                            }}
                        >
                            {entry.explanation}
                        </p>
                    </div>
                    <div>
                        <span
                            style={{
                                fontSize: "0.7rem",
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
                                margin: "0.25rem 0 0",
                                lineHeight: 1.7,
                                color: vars.colour.text,
                                fontSize: "0.95rem",
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
                            padding: "0.5rem 0.75rem",
                        }}
                    >
                        <AlertTriangle size={14} /> Compare across languages
                    </button>
                ) : null}
            </div>

            {/* Grid of all errors */}
            <div className={referenceListGrid}>
                {ERROR_CATALOGUE.map((e) => {
                    const on = e.id === active;
                    return (
                        <button
                            key={e.id}
                            type="button"
                            onClick={() => {
                                onSelect(e.id);
                            }}
                            className={cheatCard}
                            style={{
                                cursor: "pointer",
                                textAlign: "left",
                                border: "none",
                                width: "100%",
                                background: on
                                    ? vars.colour.accentDim
                                    : vars.colour.panel2,
                                outline: on
                                    ? `1px solid ${vars.colour.accent}`
                                    : `1px solid ${vars.colour.border}`,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    padding: "0.1rem 0.35rem",
                                    borderRadius: "0.2rem",
                                    background: on
                                        ? vars.colour.accent
                                        : vars.colour.accentDim,
                                    color: on
                                        ? vars.colour.panel
                                        : vars.colour.accentSoft,
                                }}
                            >
                                {e.code}
                            </span>
                            <span
                                style={{
                                    color: vars.colour.text,
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }}
                            >
                                {e.title}
                            </span>
                            <span
                                style={{
                                    color: vars.colour.dim,
                                    fontSize: "0.8rem",
                                    lineHeight: 1.4,
                                }}
                            >
                                {e.explanation.length > 100
                                    ? e.explanation.slice(0, 100) + "..."
                                    : e.explanation}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
