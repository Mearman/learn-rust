import { useCallback, useState } from "react";
import type { UserProfile, UserProfileUpdater } from "./types.ts";
import { isUserProfile } from "./types.ts";

const STORAGE_KEY = "rbc-profile-v3";

const DEFAULT_PROFILE: UserProfile = {
    background: "none",
    familiarity: "none",
    experience: "intermediate",
};

function loadProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (!isUserProfile(parsed)) {
        throw new Error("Stored Rust by Concept profile is invalid");
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
