import type { Concept } from "./types.ts";

export const CONCEPTS: readonly Concept[] = [
    {
        id: "memory-management",
        title: "Memory management",
        description: "How values are allocated, who owns them, and when they are freed.",
        lessonIds: ["ownership", "smart-pointers"],
    },
    {
        id: "reference-semantics",
        title: "Reference semantics",
        description: "How references, pointers, and aliases work — who can read, who can mutate.",
        lessonIds: ["borrowing"],
    },
    {
        id: "string-types",
        title: "String types",
        description: "How text is represented — borrowed views, owned buffers, and the conversion points.",
        lessonIds: ["slices"],
    },
    {
        id: "reference-validity",
        title: "Reference validity",
        description: "How to prove that borrowed data outlives every reference to it.",
        lessonIds: ["lifetimes"],
    },
    {
        id: "algebraic-data-types",
        title: "Algebraic data types",
        description: "Sum types, pattern matching, and exhaustive handling of variants.",
        lessonIds: ["enums"],
    },
    {
        id: "error-signalling",
        title: "Error signalling",
        description: "How absence (no value) and failure (something went wrong) are modelled in the type system.",
        lessonIds: ["option-result"],
    },
    {
        id: "behaviour-abstraction",
        title: "Behaviour abstraction",
        description: "How shared behaviour is defined — interfaces, traits, protocols, and dispatch strategies.",
        lessonIds: ["traits"],
    },
    {
        id: "generics",
        title: "Generics",
        description: "How one definition serves many types — monomorphisation, erasure, and constraints.",
        lessonIds: ["generics"],
    },
    {
        id: "collection-pipelines",
        title: "Collection pipelines",
        description: "Chained transformations over sequences — map, filter, reduce, and lazy evaluation.",
        lessonIds: ["iterators"],
    },
    {
        id: "smart-pointers",
        title: "Smart pointers",
        description: "Heap allocation, shared ownership, reference counting, and interior mutability as types.",
        lessonIds: ["smart-pointers"],
    },
] as const;

export const LESSON_CONCEPT_MAP: Readonly<Record<string, string>> = {
    ownership: "memory-management",
    borrowing: "reference-semantics",
    slices: "string-types",
    lifetimes: "reference-validity",
    enums: "algebraic-data-types",
    "option-result": "error-signalling",
    traits: "behaviour-abstraction",
    generics: "generics",
    iterators: "collection-pipelines",
    "smart-pointers": "smart-pointers",
};
