import type { Challenge } from "./challenges.ts";
import { CHALLENGES } from "./challenges.ts";

export interface ChallengeState {
    readonly index: number;
    readonly answered: boolean;
    readonly guess: boolean | null;
    readonly correct: number;
    readonly total: number;
}

export type ChallengeAction =
    | { readonly type: "answer"; readonly guess: boolean }
    | { readonly type: "next" }
    | { readonly type: "reset" };

export function challengeReducer(
    state: ChallengeState,
    action: ChallengeAction,
    challenges: readonly Challenge[] = CHALLENGES
): ChallengeState {
    switch (action.type) {
        case "answer": {
            const ch = challenges[state.index];
            return {
                ...state,
                answered: true,
                guess: action.guess,
                total: state.total + 1,
                correct:
                    state.correct +
                    (ch !== undefined && action.guess === ch.compiles ? 1 : 0),
            };
        }
        case "next": {
            return {
                ...state,
                index: state.index + 1,
                answered: false,
                guess: null,
            };
        }
        case "reset": {
            return {
                index: 0,
                answered: false,
                guess: null,
                correct: 0,
                total: 0,
            };
        }
    }
}
