/** Shared runtime type guards used across persisted-state loaders. */

/** Narrows an unknown value to a readonly array of strings. */
export function isStringArray(value: unknown): value is readonly string[] {
    return (
        Array.isArray(value) && value.every((item) => typeof item === "string")
    );
}
