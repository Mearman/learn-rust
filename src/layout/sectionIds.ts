/**
 * Canonical builders for the element ids that drive scroll navigation. Every
 * id ↔ scroll-target round-trip must agree: the id rendered onto an element
 * (e.g. in SyntaxView and the TOC tree) has to match the id the scroll helpers
 * look up. Keeping the rules here means the producer and the consumer cannot
 * drift apart.
 */

/**
 * Slug form of a syntax topic: spaces collapsed to single hyphens, lowercased.
 * This is the suffix of a `syntax-<slug>` element id — see {@link syntaxId}.
 */
export function syntaxSlug(topic: string): string {
    return topic.replace(/\s+/g, "-").toLowerCase();
}

/** The `syntax-<slug>` element id for a syntax topic. */
export function syntaxId(topic: string): string {
    return `syntax-${syntaxSlug(topic)}`;
}
