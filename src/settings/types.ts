export type LanguageFamiliarity =
    | "python"
    | "typescript"
    | "java"
    | "kotlin"
    | "go"
    | "csharp"
    | "cpp";

export type DeveloperBackground =
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
    readonly backgrounds: readonly DeveloperBackground[];
    readonly familiarities: readonly LanguageFamiliarity[];
    readonly experience: ExperienceLevel;
}

export type UserProfileUpdater = (updater: (prev: UserProfile) => UserProfile) => void;

export function isLanguageFamiliarity(value: string): value is LanguageFamiliarity {
    return (
        value === "python"
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
        value === "frontend"
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

function isStringArray(value: unknown): value is readonly string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isUserProfile(value: unknown): value is UserProfile {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    if (!("backgrounds" in value) || !("familiarities" in value) || !("experience" in value)) return false;
    if (!isStringArray(value.backgrounds) || !isStringArray(value.familiarities)) return false;
    if (typeof value.experience !== "string") return false;
    return value.backgrounds.every(isDeveloperBackground)
        && value.familiarities.every(isLanguageFamiliarity)
        && isExperienceLevel(value.experience);
}
