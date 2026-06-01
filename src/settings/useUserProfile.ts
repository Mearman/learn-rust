import { useCallback, useState } from "react";
import type { UserProfile, UserProfileUpdater } from "./types.ts";
import { isUserProfile } from "./types.ts";

const STORAGE_KEY = "rbc-profile-v4";

const DEFAULT_PROFILE: UserProfile = {
    backgrounds: [],
    familiarities: [],
    experience: "intermediate",
};

function loadProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (!isUserProfile(parsed)) {
        console.warn(
            `[rbc] Stored profile under "${STORAGE_KEY}" failed validation — ` +
                "falling back to default and clearing the key."
        );
        localStorage.removeItem(STORAGE_KEY);
        return DEFAULT_PROFILE;
    }
    return parsed;
}

export function useUserProfile(): readonly [UserProfile, UserProfileUpdater] {
    const [profile, setProfile] = useState<UserProfile>(loadProfile);

    const updateProfile = useCallback<UserProfileUpdater>((updater) => {
        setProfile((prev) => {
            const next = updater(prev);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return [profile, updateProfile] as const;
}
