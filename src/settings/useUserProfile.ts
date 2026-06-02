import { useCallback, useState } from "react";
import type { UserProfile, UserProfileUpdater } from "./types.ts";
import { isUserProfile } from "./types.ts";
import { createLocalStore } from "./createLocalStore.ts";

const STORAGE_KEY = "rbc-profile-v5";

const DEFAULT_PROFILE: UserProfile = {
    backgrounds: [],
    familiarities: [],
    experience: "intermediate",
    hardGating: false,
};

const store = createLocalStore<UserProfile, UserProfile>({
    key: STORAGE_KEY,
    guard: isUserProfile,
    fallback: DEFAULT_PROFILE,
    label: "profile",
    decode: (stored) => stored,
    encode: (value) => value,
});

export function useUserProfile(): readonly [UserProfile, UserProfileUpdater] {
    const [profile, setProfile] = useState<UserProfile>(store.load);

    const updateProfile = useCallback<UserProfileUpdater>((updater) => {
        setProfile((prev) => {
            const next = updater(prev);
            store.save(next);
            return next;
        });
    }, []);

    return [profile, updateProfile] as const;
}
