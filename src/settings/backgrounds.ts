import type { DeveloperBackground } from "./types.ts";

export const DEVELOPER_BACKGROUND_OPTIONS = [
    { value: "none", label: "No specific background" },
    { value: "frontend", label: "Frontend / web" },
    { value: "backend", label: "Backend / API" },
    { value: "mobile", label: "Mobile" },
    { value: "systems", label: "Systems" },
    { value: "devops", label: "DevOps / platform" },
    { value: "data", label: "Data / analytics" },
    { value: "game-dev", label: "Game development" },
    { value: "embedded", label: "Embedded" },
    { value: "student", label: "Student / new to code" },
    { value: "self-taught", label: "Self-taught" },
    { value: "other", label: "Something else" },
] as const;

export function developerBackgroundLabel(background: Exclude<DeveloperBackground, "none">): string {
    if (background === "frontend") return "Frontend / web";
    if (background === "backend") return "Backend / API";
    if (background === "mobile") return "Mobile";
    if (background === "systems") return "Systems";
    if (background === "devops") return "DevOps / platform";
    if (background === "data") return "Data / analytics";
    if (background === "game-dev") return "Game development";
    if (background === "embedded") return "Embedded";
    if (background === "student") return "Student / new to code";
    if (background === "self-taught") return "Self-taught";
    return "Something else";
}
