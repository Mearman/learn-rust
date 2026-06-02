# Pedagogy proposals

Three feature-sized improvements to the learning experience. None of these are
implemented — this document is a design proposal.

---

## 1. Lesson gating and concept-graph sequencing

**Problem.** The app currently shows all ten lessons in a fixed order regardless
of what the reader has absorbed. A beginner who opens "Smart pointers" without
having read "Ownership" will hit unexplained terms (Drop, interior mutability,
reference counting) with no prior grounding. The dependency graph in
`src/data/dependencies.ts` exists but nothing acts on it.

**Proposal.** Use the dependency graph to gate or visually sequence lessons.

Two possible modes:

*Soft gating (recommended starting point).* Lessons with unmet dependencies are
shown but visually marked as having prerequisites. A banner on the lesson card
lists the lessons to read first, with jump links. The reader can still open any
lesson — the gate is advisory, not a lock. This respects autonomy without letting
learners walk into confusing territory blindly.

*Hard gating (stronger variant).* Lessons with unmet dependencies are collapsed
behind a "prerequisites incomplete" accordion. They expand only once the dwell
timer has fired on each prerequisite. Harder to ignore; also harder to work
around for readers who have prior knowledge and just want a specific lesson.

Either mode requires the dependency graph to be complete (the edges added in
this batch help) and requires a way to check "has this lesson been viewed". The
`useViewedLessons` hook and `viewed: ReadonlySet<string>` already exist — the
gating UI just reads that set.

**Path graph view.** The sidebar or a separate "learning path" section could
render the dependency graph as a visual DAG using the concept ids as nodes.
Completed nodes shown in a distinct colour, locked nodes greyed out. This would
make the learning path tangible rather than implicit.

**What to implement.** Start with soft gating only. Add a `isLessonReady(lessonId, viewed, dependencies)` helper in `src/data/dependencies.ts`, wire it into `LessonArticle`, and render a prerequisite-links banner when it returns false. The hard gating and graph view are follow-up work.

---

## 2. Active-recall exercises, "fix this code" challenges, and spaced repetition

**Problem.** The current challenge section is a read-only quiz: you read code,
read whether it compiles, read the explanation. There is no active recall — the
reader never has to retrieve information before seeing the answer. Active recall
is the single best-evidenced technique for moving knowledge from short-term to
long-term memory (Roediger & Karpicke 2006).

The challenge levels (warm-up, core, tricky) and the `CHALLENGES` array are good
raw material; the missing piece is the interaction model.

**Proposal: "Fix this code" mode.** For challenges where `compiles: false` and a
`fix` is provided, offer a "fix this" toggle. In fix mode:

- The broken code is shown in an editable text area (or the existing Playground
  integration).
- The reader makes their edit and runs it against the Rust Playground.
- If the run returns no compile errors, the challenge is marked complete.
- The explanation and fix are revealed only after a correct submission (or after
  an explicit "give up" button).

This turns passive reading into active problem-solving. The Playground backend
already exists (`src/compiler/PlaygroundBackend.ts`); fix mode just needs an
editable code input wired to `useCompiler`.

**Proposal: Spaced repetition.** The `useViewedLessons` hook already tracks
which lessons have been dwelt on. Extend this to challenges with a lightweight
spaced-repetition schedule:

- Store per-challenge state: first seen, last answered correctly, interval (days).
- On each session start, surface challenges due for review (interval elapsed since
  last correct answer) in a "due for review" bucket at the top of the challenge
  section.
- Use a simple SM-2-style algorithm: on correct answer, multiply the interval by a
  quality factor (1.5–2.5 depending on how quickly they answered); on wrong
  answer, reset to 1 day.

This does not require a server. `localStorage` is sufficient for a single-device
experience; the profile persistence already uses the same approach.

**Proposal: Multiple-choice active recall.** For concepts that are hard to
express as "fix this code" (e.g. naming elision rules, identifying which lifetime
annotation is wrong in a signature), add a `choices` field to `Challenge` with
three to four options. Present the question, require a choice before revealing the
explanation. Wrong answers highlight the misconception before showing the correct
reasoning.

**What to implement first.** Fix-this-code mode for `compiles: false` challenges
with a `fix` field. It reuses the existing Playground integration with minimal new
infrastructure. Spaced repetition is a self-contained feature on top of that —
implement it once the fix mode interaction is stable.

---

## 3. Async/Send/Sync coverage and "reading compiler errors" skill-building

**Problem.** The ten current lessons cover the synchronous core of Rust. Async
Rust — `async/await`, `Future`, `Pin`, `Send`, `Sync`, `tokio` — is a separate
conceptual layer that the app does not address. For many learners, async is where
they actually get stuck in practice: the error messages are long, the trait
machinery is invisible, and the mental model from other languages (green threads,
goroutines, promises) does not map cleanly.

A second gap: the app teaches what errors mean in general but does not build the
skill of reading the specific error messages the Rust compiler emits. Beginners
routinely abandon Rust because they cannot parse `E0502`, `E0597`, `E0277`, or
the lifetime-related cascade errors that a single annotation mistake produces.

### 3a. Async/Send/Sync lesson

A new lesson (id: `async-basics`) following "Smart pointers" in the learning
path, covering:

- `async fn` and `.await` — syntax and mental model (state machines, not threads)
- `Future<Output = T>` as a lazy computation
- A runtime executor (Tokio or async-std) as the thing that drives Futures
- `Send` and `Sync` as auto traits — what they mean, which types satisfy them,
  and why `Rc<T>` is not `Send`
- Common async error patterns: not `.await`-ing a Future, holding a non-`Send`
  type across an `.await`, `async` in a `dyn Trait` context

The lesson would follow the same structure as existing lessons: text blocks,
code blocks, analogy block, comparison block (how goroutines / promises / async
streams compare), and a deep-dive on the `Pin` / `Unpin` story for
self-referential Futures.

The Playground backend supports async code; a `#[tokio::main]` snippet would
need the tokio feature flag. Confirm at implementation time whether the
playground supports `tokio`.

### 3b. "Reading compiler errors" section

A dedicated section (separate from the existing `errors` section, which covers
common mistakes, not error-reading skill) with:

- A set of annotated error transcripts. Each transcript shows a real `rustc`
  error output with inline annotations explaining what each part means: the error
  code, the primary span, the secondary spans, the note and help lines, and what
  action to take.
- Progressive complexity: start with `E0308` (type mismatch — the simplest
  structure), then `E0502`/`E0505` (borrow conflicts), then `E0597` (lifetime
  errors), then `E0277` (trait bound not satisfied).
- "Decode this error" exercises: show an error transcript, ask the reader to
  identify the root cause and the fix before revealing the answer.

This section does not require a Playground integration. The error transcripts are
static content in a new data module (e.g. `src/data/compiler-errors.ts`) following
the same typed-data pattern as the existing content modules.

**What to implement first.** The error-reading section is entirely static content
— no new infrastructure beyond a new data module and a view component. It can be
built before the async lesson. The async lesson requires new lesson data plus a
check on Playground async support.

---

## Implementation order

If all three were prioritised:

1. "Fix this code" active-recall challenges (reuses existing infra, high
   pedagogical return).
2. Compiler error reading section (static content, no new infra, addresses a
   major drop-off point).
3. Lesson gating with soft prerequisite banners (moderate complexity, builds on
   existing viewed state).
4. Async/Send/Sync lesson (new content, confirm Playground async support first).
5. Spaced repetition (depends on fix-this-code being stable).
6. Multiple-choice active recall and graph view (polish, can be parallelised with 5).
