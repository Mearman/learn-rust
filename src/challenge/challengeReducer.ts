export interface ChallengeState {
    /** Map of challenge id to the learner's guess (true = "compiles").
     *  A key's presence means that challenge has been answered. */
    readonly answers: Readonly<Record<string, boolean>>;
}

export type ChallengeAction =
    | { readonly type: "answer"; readonly id: string; readonly guess: boolean }
    | { readonly type: "reset" };

export function challengeReducer(
    state: ChallengeState,
    action: ChallengeAction
): ChallengeState {
    switch (action.type) {
        case "answer": {
            // A challenge locks once answered — the first guess stands.
            if (action.id in state.answers) return state;
            return {
                answers: { ...state.answers, [action.id]: action.guess },
            };
        }
        case "reset": {
            return { answers: {} };
        }
    }
}
