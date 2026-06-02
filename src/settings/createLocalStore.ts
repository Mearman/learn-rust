/**
 * A single source of truth for reading and writing validated JSON to
 * localStorage.
 *
 * Every persisted-state loader in the app needs the same defensive shape: read
 * the key, `JSON.parse` it inside a try/catch, validate the parsed value with a
 * type guard, and on any parse-or-guard failure warn, clear the corrupt key,
 * and fall back to a default. Doing this by hand in each loader is how a missing
 * try/catch white-screens the whole app on corrupt storage. This factory
 * centralises that contract so a loader cannot forget a piece of it.
 *
 * The stored representation (`Stored`) and the in-memory value (`Value`) may
 * differ — e.g. a `Set` persists as a string array. The `decode`/`encode` pair
 * bridges them; the guard validates the *stored* shape after parsing.
 */
export interface LocalStore<Value> {
    /** Read and validate the value, falling back to the default on absence or
     *  corruption (corrupt keys are warned about and removed). */
    readonly load: () => Value;
    /** Serialise and persist the value under the configured key. */
    readonly save: (value: Value) => void;
}

interface LocalStoreConfig<Value, Stored> {
    /** The localStorage key. */
    readonly key: string;
    /** Validates the parsed (stored-shape) value. */
    readonly guard: (value: unknown) => value is Stored;
    /** Value returned when the key is absent or the stored value is corrupt. */
    readonly fallback: Value;
    /** A human-readable name for the stored data, used in the warning. */
    readonly label: string;
    /** Maps the validated stored shape to the in-memory value. */
    readonly decode: (stored: Stored) => Value;
    /** Maps the in-memory value to its stored shape for serialisation. */
    readonly encode: (value: Value) => Stored;
}

export function createLocalStore<Value, Stored>(
    config: LocalStoreConfig<Value, Stored>
): LocalStore<Value> {
    const { key, guard, fallback, label, decode, encode } = config;

    const load = (): Value => {
        let raw: string | null;
        try {
            raw = localStorage.getItem(key);
        } catch {
            // Storage unavailable (e.g. privacy mode) — use the default.
            return fallback;
        }
        if (raw === null) return fallback;

        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            warnAndClear(key, label);
            return fallback;
        }

        if (!guard(parsed)) {
            warnAndClear(key, label);
            return fallback;
        }
        return decode(parsed);
    };

    const save = (value: Value): void => {
        localStorage.setItem(key, JSON.stringify(encode(value)));
    };

    return { load, save };
}

function warnAndClear(key: string, label: string): void {
    console.warn(
        `[rbc] Stored ${label} under "${key}" failed validation — ` +
            "falling back to the default and clearing the key."
    );
    try {
        localStorage.removeItem(key);
    } catch {
        // If removal also fails there is nothing more we can do; the load has
        // already fallen back to the default, so the app stays usable.
    }
}
