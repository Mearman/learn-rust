export type BackgroundLanguage =
    | "none"
    | "python"
    | "typescript"
    | "java"
    | "kotlin"
    | "go"
    | "csharp"
    | "cpp";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
    readonly background: BackgroundLanguage;
    readonly experience: ExperienceLevel;
}

export type UserProfileUpdater = (updater: (prev: UserProfile) => UserProfile) => void;

export function isBackgroundLanguage(value: string): value is BackgroundLanguage {
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

export function isExperienceLevel(value: string): value is ExperienceLevel {
    return value === "beginner" || value === "intermediate" || value === "advanced";
}

export function isUserProfile(value: unknown): value is UserProfile {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    if (!("background" in value) || !("experience" in value)) return false;
    if (typeof value.background !== "string" || typeof value.experience !== "string") return false;
    return isBackgroundLanguage(value.background) && isExperienceLevel(value.experience);
}
