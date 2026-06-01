import type { DeveloperBackground } from "./types.ts";

function noteForBackground(background: DeveloperBackground): string {
    if (background === "frontend") {
        return "If you mostly ship UI code, think of this as moving a whole class of runtime bugs into the compiler.";
    }
    if (background === "backend") {
        return "If you work on services and APIs, Rust is forcing the same discipline your tests and production alerts usually discover too late.";
    }
    if (background === "mobile") {
        return "If you build mobile apps, this is the language making state transitions explicit instead of relying on app lifecycle luck.";
    }
    if (background === "systems") {
        return "If you already think in terms of ownership and lifetimes, Rust is giving those rules names the compiler can enforce.";
    }
    if (background === "devops") {
        return "If you live near deployment pipelines, this is the sort of correctness that saves you from rollout-time surprises.";
    }
    if (background === "data") {
        return "If you work with data transforms, Rust is making invalid states and partial failures impossible to ignore.";
    }
    if (background === "game-dev") {
        return "If you build games, this is the same low-level performance story with the memory rules written down for you.";
    }
    if (background === "embedded") {
        return "If you work close to hardware, Rust is the compiler backing up the discipline you already need.";
    }
    if (background === "student") {
        return "If this is your first systems language, focus on the shape of the rule rather than the syntax.";
    }
    if (background === "self-taught") {
        return "If you’ve learned by building, treat each rule as a way to move a bug you already know into compile time.";
    }
    return "Use the compiler as the thing that catches the bug before the code ships.";
}

export function backgroundContextNotes(backgrounds: readonly DeveloperBackground[]): readonly string[] {
    const notes: string[] = [];
    for (const background of backgrounds) {
        notes.push(noteForBackground(background));
    }
    return Array.from(new Set(notes));
}
