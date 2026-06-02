import { challengeStack } from "../theme/styles.css.ts";
import { fixIntro } from "./fix.css.ts";
import { FixCard } from "./FixCard.tsx";
import type { FixExercise } from "../data/types.ts";

interface FixViewProps {
    readonly exercises: readonly FixExercise[];
}

/** The Fix-it section: a stack of broken Rust snippets the reader repairs
 *  against the live Playground. The exercises are profile-filtered by the
 *  caller (beginners get warm-ups only). */
export function FixView({ exercises }: FixViewProps) {
    return (
        <div className={challengeStack}>
            <p className={fixIntro}>
                Each snippet below is broken. Repair it in the editor and run it
                against the live Rust Playground until the compiler accepts it,
                then compare your repair with the idiomatic fix. Stuck? Reveal a
                hint one step at a time, or jump straight to the answer.
            </p>
            {exercises.map((exercise, i) => (
                <FixCard
                    key={exercise.id}
                    exercise={exercise}
                    number={i + 1}
                    total={exercises.length}
                />
            ))}
        </div>
    );
}
