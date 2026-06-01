export type LanguageFamiliarity =
    | "none"
    | "python"
    | "typescript"
    | "java"
    | "kotlin"
    | "go"
    | "csharp"
    | "cpp";

export type DeveloperBackground =
    | "none"
    | "frontend"
    | "backend"
    | "mobile"
    | "systems"
    | "devops"
    | "data"
    | "game-dev"
    | "embedded"
    | "student"
    | "self-taught"
    | "other";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
    readonly background: DeveloperBackground;
    readonly familiarity: LanguageFamiliarity;
    readonly experience: ExperienceLevel;
}

export type UserProfileUpdater = (updater: (prev: UserProfile) => UserProfile) => void;

export function isLanguageFamiliarity(value: string): value is LanguageFamiliarity {
    return (
        value === "none"
        || value === "python"
        || value === "typescript"
        || value === "java"
        || value === "kotlin"
        || value === "go"
        || value === "csharp"
        || value === "cpp"
    );
}

export function isDeveloperBackground(value: string): value is DeveloperBackground {
    return (
        value === "none"
        || value === "frontend"
        || value === "backend"
        || value === "mobile"
        || value === "systems"
        || value === "devops"
        || value === "data"
        || value === "game-dev"
        || value === "embedded"
        || value === "student"
        || value === "self-taught"
        || value === "other"
    );
}

export function isExperienceLevel(value: string): value is ExperienceLevel {
    return value === "beginner" || value === "intermediate" || value === "advanced";
}

export function isUserProfile(value: unknown): value is UserProfile {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    if (!("background" in value) || !("familiarity" in value) || !("experience" in value)) return false;
    if (typeof value.background !== "string" || typeof value.familiarity !== "string" || typeof value.experience !== "string") return false;
    return isDeveloperBackground(value.background) && isLanguageFamiliarity(value.familiarity) && isExperienceLevel(value.experience);
}
