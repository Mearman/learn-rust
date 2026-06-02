# [1.5.0](https://github.com/Mearman/learn-rust/compare/v1.4.1...v1.5.0) (2026-06-02)


### Bug Fixes

* add async LanguageConcept rows so the async lesson renders ([84008af](https://github.com/Mearman/learn-rust/commit/84008afbfbecb5a0ed31c742beebe899e98a45e3))
* correct lifetime MC misconception that claimed a non-compiling signature compiles ([f53e2ba](https://github.com/Mearman/learn-rust/commit/f53e2ba4bfd5a6050070c3cc3eba094230a0505c))


### Features

* add a compiler-error reading section ([7f9a48a](https://github.com/Mearman/learn-rust/commit/7f9a48a273eabb53854e2a66efd7b59d9f3de64d))
* add async & Send/Sync lesson ([8d10ae7](https://github.com/Mearman/learn-rust/commit/8d10ae76593b0be7cbe1736f2ed84436a4a9d6e3))
* add fix-this-code mode to challenge cards ([7699086](https://github.com/Mearman/learn-rust/commit/76990864c0fb5511f603a1ee3b82ae915b7f240a))
* add multiple-choice active recall to challenge cards ([33ccbb0](https://github.com/Mearman/learn-rust/commit/33ccbb00a89e404618f2fade276ad8e7f354c9a1))
* **challenge:** add SM-2 spaced repetition with due-for-review bucket ([5dbc62b](https://github.com/Mearman/learn-rust/commit/5dbc62b0a3df9717dfc33f62f779ca46abac4ef8))
* colour dependency-graph nodes by lesson-viewed state in path view ([33bddc4](https://github.com/Mearman/learn-rust/commit/33bddc48a3b85a1e8ac990953478a9014106543d))
* **data:** add annotated compiler-error transcripts ([c3dd4fc](https://github.com/Mearman/learn-rust/commit/c3dd4fc5c1c5e3320c91d947a553221959da29c1))
* soft lesson gating with prerequisite advisory banner ([c1c43db](https://github.com/Mearman/learn-rust/commit/c1c43db223c26155d39b6201397d09ebdc612517))

## [1.4.1](https://github.com/Mearman/learn-rust/compare/v1.4.0...v1.4.1) (2026-06-02)


### Bug Fixes

* show the compact tailoring strip only after the header scrolls away ([3709d5f](https://github.com/Mearman/learn-rust/commit/3709d5f71824b427cab2195fc5f8e07ffecafc48))

# [1.4.0](https://github.com/Mearman/learn-rust/compare/v1.3.0...v1.4.0) (2026-06-02)


### Bug Fixes

* add aria-hidden to decorative icons in ChallengeView and fix label formatting ([a3e327e](https://github.com/Mearman/learn-rust/commit/a3e327eed116ced389087bf020b36851b18dbe25))
* correct five factual errors in lessons.ts ([56394aa](https://github.com/Mearman/learn-rust/commit/56394aab74e2746dc90b4fc89a768e8068d55018))
* correct mis-assigned error codes in the error catalogue ([125cff4](https://github.com/Mearman/learn-rust/commit/125cff4dea7665090b40d0090beb3eed56826bb4))
* correct three inaccurate glossary definitions ([66f1755](https://github.com/Mearman/learn-rust/commit/66f1755faa40c144f9bb4edb8bfae7d3cc9f8b66))
* correct two factual errors in language-concepts ([d8743a5](https://github.com/Mearman/learn-rust/commit/d8743a5019d00497b7decd1749ecf1da452b13fd))
* make footer Playground reference a clickable link ([e17db7e](https://github.com/Mearman/learn-rust/commit/e17db7e5dc35e8badf891da29d9640f3e1e01e33))
* remove F# syntax from the C# enum example ([225a45d](https://github.com/Mearman/learn-rust/commit/225a45d538154b43f0461c6e94b8a7c0bc4ae28c))
* replace hardcoded [#1](https://github.com/Mearman/learn-rust/issues/1)a0f08 with vars.colour.accentText token ([45340d5](https://github.com/Mearman/learn-rust/commit/45340d5306465d717dfa3074e6fcb04d29dab61f)), closes [#1a0f08](https://github.com/Mearman/learn-rust/issues/1a0f08) [#1a0f08](https://github.com/Mearman/learn-rust/issues/1a0f08) [#ffffff](https://github.com/Mearman/learn-rust/issues/ffffff)
* show lesson titles instead of raw IDs in ProgressionView ([3453de8](https://github.com/Mearman/learn-rust/commit/3453de8ae63df17cf1704f93973d94721fc0edde))
* **theme:** WCAG AA contrast, accentText token, spin keyframes, safe-area, focus-visible ([02e5f22](https://github.com/Mearman/learn-rust/commit/02e5f2233f1b38a2cdfd287d6fa0e7d4b00a8f4b)), closes [#f8f6f3](https://github.com/Mearman/learn-rust/issues/f8f6f3) [#ffffff](https://github.com/Mearman/learn-rust/issues/ffffff) [#f0ede8](https://github.com/Mearman/learn-rust/issues/f0ede8) [#f5f3ef](https://github.com/Mearman/learn-rust/issues/f5f3ef) [#a8a29e](https://github.com/Mearman/learn-rust/issues/a8a29e) [#706a64](https://github.com/Mearman/learn-rust/issues/706a64) [#d45a25](https://github.com/Mearman/learn-rust/issues/d45a25) [#b8481c](https://github.com/Mearman/learn-rust/issues/b8481c) [#e87040](https://github.com/Mearman/learn-rust/issues/e87040) [#a0441c](https://github.com/Mearman/learn-rust/issues/a0441c) [#16a34a](https://github.com/Mearman/learn-rust/issues/16a34a) [#147a3a](https://github.com/Mearman/learn-rust/issues/147a3a) [#dc2626](https://github.com/Mearman/learn-rust/issues/dc2626) [#ce1f1f](https://github.com/Mearman/learn-rust/issues/ce1f1f) [#1a0f08](https://github.com/Mearman/learn-rust/issues/1a0f08) [#e2703a](https://github.com/Mearman/learn-rust/issues/e2703a) [#ffffff](https://github.com/Mearman/learn-rust/issues/ffffff) [#b8481c](https://github.com/Mearman/learn-rust/issues/b8481c)


### Features

* add fetch timeout and Rust Playground attribution to compiler ([69a6e5c](https://github.com/Mearman/learn-rust/commit/69a6e5ce0f569720d149c87c134460a82395e0ae))
* add filter input to desktop sidebar TOC ([66fbcbe](https://github.com/Mearman/learn-rust/commit/66fbcbe886aaf3bbb0a874ba751ef4edf73ea56a))
* add search hint when query is empty or too short ([6958fb4](https://github.com/Mearman/learn-rust/commit/6958fb4d6dcd937e36376fad80784faeba2dbd05))
* add useBodyScrollLock hook and apply to search overlay and mobile TOC ([d37b890](https://github.com/Mearman/learn-rust/commit/d37b8909619b5f92697c3f6233c23d8f87924baf))
* **challenge:** loosen beginner filter to include core challenges ([bd5c166](https://github.com/Mearman/learn-rust/commit/bd5c166392b3b78d10169603b1570ce466ee8ac5))
* **data:** add missing dependency edges to concept graph ([02bd24d](https://github.com/Mearman/learn-rust/commit/02bd24da4b8acbc9d478310439ff50e1a1d5270e))
* **learn:** deepen traits and lifetimes lessons; add Copy/Clone and Deref coercion ([78fe860](https://github.com/Mearman/learn-rust/commit/78fe86080ecdef00f53b0750abdbbda402a975f1))
* **learn:** per-lesson background context notes ([ad13f2c](https://github.com/Mearman/learn-rust/commit/ad13f2c92c31445e272a187f60c77b1cfddead55))
* mark lessons as read after 3 s of dwell time ([6fd36f8](https://github.com/Mearman/learn-rust/commit/6fd36f86416418d1516343ad4209452f1a2c6658))
* preserve manually-opened TOC sections across scroll changes ([da4d0c1](https://github.com/Mearman/learn-rust/commit/da4d0c1d920ec923a2ac83914bfdb758a489d5c0))
* show brief visual feedback when tailoring settings change ([1fc8242](https://github.com/Mearman/learn-rust/commit/1fc8242542fe9b15e059f55b86307b987f43a9a0))

# [1.3.0](https://github.com/Mearman/learn-rust/compare/v1.2.0...v1.3.0) (2026-06-02)


### Features

* live-update the URL hash from scroll position ([7957a73](https://github.com/Mearman/learn-rust/commit/7957a737c8a40f0458dac76a4da6cdfd05e9731d))
* nest the URL hash as section/entry, linkable to section headers ([d81e251](https://github.com/Mearman/learn-rust/commit/d81e25114e71994bc0660017589d68aa618baf50)), closes [#section](https://github.com/Mearman/learn-rust/issues/section) [#compare](https://github.com/Mearman/learn-rust/issues/compare) [#section](https://github.com/Mearman/learn-rust/issues/section)

# [1.2.0](https://github.com/Mearman/learn-rust/compare/v1.1.0...v1.2.0) (2026-06-02)


### Bug Fixes

* keep compact strip selects at a clickable width ([4f4e06d](https://github.com/Mearman/learn-rust/commit/4f4e06d7bfedf1cd989a4ea04cb00ab7531b656d))


### Features

* pin a slim always-visible tailoring strip above the nav ([cb50e92](https://github.com/Mearman/learn-rust/commit/cb50e92ffe5e09fba64217fb33151e24d8b040fe))

# [1.1.0](https://github.com/Mearman/learn-rust/compare/v1.0.0...v1.1.0) (2026-06-02)


### Features

* star sidebar entries to keep them visible when collapsed ([7335cca](https://github.com/Mearman/learn-rust/commit/7335cca586a2d9063adc302cb86c0aceaf280b65))
* vertical card stacks and answerable challenge cards as sidebar entries ([0d9c1b1](https://github.com/Mearman/learn-rust/commit/0d9c1b15390c822ad405b8dd0ee98b324860cbf9))

# 1.0.0 (2026-06-02)


### Bug Fixes

* add \@types/node for tsconfig.node.json ([64329c1](https://github.com/Mearman/learn-rust/commit/64329c19b202cb1770955aacd029661e4df9879b))
* add \@typescript-eslint/utils as direct dep for typed rule module ([7458f51](https://github.com/Mearman/learn-rust/commit/7458f513f49bcd3de59bf16d4a75801e4610e3a3))
* avoid cascading-render setState in useActiveSubSection ([60aec4e](https://github.com/Mearman/learn-rust/commit/60aec4e8f576f9e1bb5873037c079a9161a60c42))
* correct raw-string tokenisation to handle quoted content and longer hash delimiters ([f3eade9](https://github.com/Mearman/learn-rust/commit/f3eade97ed79afdd3600af7832a4351bba438383))
* declare @typescript-eslint/parser as a direct devDependency ([69b1ffc](https://github.com/Mearman/learn-rust/commit/69b1ffc4688c5bffaf9e2fc727b8c5f7e051e16f))
* fall back to default profile on invalid stored data ([1b5a79e](https://github.com/Mearman/learn-rust/commit/1b5a79e59cbc376632b20cad31316b31798b5f39))
* keep eslint.config.ts in tsconfig.node.json for full type safety ([4e558fa](https://github.com/Mearman/learn-rust/commit/4e558fa16b532c97075912d5ddda0ed3bf3e3cb4))
* null-safety in noReExports rule's removeStatement ([58c22d4](https://github.com/Mearman/learn-rust/commit/58c22d45971b5851c6b07a61e51a8e051baf3dcc))
* pass vitest with no test files ([c811e8a](https://github.com/Mearman/learn-rust/commit/c811e8a205161b10b3456a86735c242eb1c63ba3))
* prettier formatting in useActiveSubSection ([7e8485e](https://github.com/Mearman/learn-rust/commit/7e8485e28dfa928a714cb9a1b4a5323b6fc7dc87))
* prevent sidebar TOC layout shifts ([fc01591](https://github.com/Mearman/learn-rust/commit/fc01591dd62e305f94d2f00b05bd16bdf549326b))
* remove setState from useEffect in useActiveSubSection ([317300e](https://github.com/Mearman/learn-rust/commit/317300e12555f044e6986b8db599508123b59ae4))
* remove unused ALL_SECTION_IDS alias ([485d832](https://github.com/Mearman/learn-rust/commit/485d8327564deead419be28418883f3f0e3899ac))
* remove unused type imports ([72d6075](https://github.com/Mearman/learn-rust/commit/72d607588ed818e28bc2f0a23cb43356d2414655))
* resolve all eslint errors for CI ([c5fe866](https://github.com/Mearman/learn-rust/commit/c5fe8664bf54485b28c6475a229438b57eb4dd0a))
* resolve all TypeScript and build errors for CI ([1c06013](https://github.com/Mearman/learn-rust/commit/1c06013603a5c818d8c837c98fdd514e74da8e59))
* resolve last CI lint errors ([d228eda](https://github.com/Mearman/learn-rust/commit/d228edac22eb8f96ca8b476b9c1f7c044e0e448e))
* resolve remaining CI lint errors ([a244b65](https://github.com/Mearman/learn-rust/commit/a244b6582a0dcca53076d6b0c90af3490cf08fd6))
* type useSyncExternalStore snapshots explicitly ([3265a6f](https://github.com/Mearman/learn-rust/commit/3265a6fb6d6e9bee6bcd1d8f4dba35a93855853b))
* type-safe custom ESLint rules and tsconfig setup ([74da2db](https://github.com/Mearman/learn-rust/commit/74da2db11ddc515b2fd7da0769281690f3961a46))
* type-safe noDynamicImports rule and target.range guard ([553d226](https://github.com/Mearman/learn-rust/commit/553d2264101f14c790af796ff109c2b78df6a497))
* use CodeBlock for syntax highlighting in cheatsheet ([0f6dc25](https://github.com/Mearman/learn-rust/commit/0f6dc257ff4fa76604e086b33be89444e14f474b))
* use type guard for ThemeMode validation ([f5759de](https://github.com/Mearman/learn-rust/commit/f5759de4066f745bed6a5fabaaa338b547946c98))
* use typed RuleModule from \@typescript-eslint/utils for custom rules ([69c4823](https://github.com/Mearman/learn-rust/commit/69c4823b393f37161fc22cad28ceda0e921a8b18))
* wrap bare snippets in fn main() for Playground compilation ([5deb717](https://github.com/Mearman/learn-rust/commit/5deb71763599a8ed7aa6a05032827f8718cda315))


### Features

* add cheatsheet view ([ddbe5e7](https://github.com/Mearman/learn-rust/commit/ddbe5e7da926be0fbd4c3c3c6265cf8b10554f8e))
* add glossary, error catalogue, progression map, search tabs ([280f8f2](https://github.com/Mearman/learn-rust/commit/280f8f2931675a76075a1339a6ecb6d253402e7b))
* add lesson data, Block renderer, and LearnView ([062047a](https://github.com/Mearman/learn-rust/commit/062047ae5deb9e84b4c757b4aec0c8352f082040))
* add lucide-react dependency ([536fd04](https://github.com/Mearman/learn-rust/commit/536fd0413b27d891c7f293e793b7a9bc213febae))
* add Mantine, Vanilla Extract, and React Compiler ([a0547e2](https://github.com/Mearman/learn-rust/commit/a0547e2d9637b30cfc4c10458661c1b9d25a38ab))
* add no-barrel-files, no-re-exports, and no-dynamic-imports rules ([ed06379](https://github.com/Mearman/learn-rust/commit/ed063792114f9a8a778c13b2178aad273ebdf945))
* add no-pointless-reassignments custom ESLint rule with autofix ([8d7aeda](https://github.com/Mearman/learn-rust/commit/8d7aeda62c65341fc29f7da5466e477e20631767))
* add personalised Rust learning paths ([6dcb610](https://github.com/Mearman/learn-rust/commit/6dcb6100708ad0c045ab5cd4d9f19620a8db62f6))
* add progression map, search view, derived cheatsheet, concept dependencies ([179a087](https://github.com/Mearman/learn-rust/commit/179a08729b6d44ef0c18623a541ab8d2e6744c8b))
* add React app entry point ([588c744](https://github.com/Mearman/learn-rust/commit/588c7448d7b8991d29bf0792c2964226eb201f8e))
* add Rust compiler error catalogue with 35 common beginner errors ([b517d2a](https://github.com/Mearman/learn-rust/commit/b517d2a9f6a7671cecfbf8d32c7ef4747b20d6bd))
* add Rust glossary data file with 51 entries ([ea429dd](https://github.com/Mearman/learn-rust/commit/ea429dd45329663334493974e60e2e7655d236ad))
* add Rust Playground compiler with Run buttons on code snippets ([869d91f](https://github.com/Mearman/learn-rust/commit/869d91f9027ce5ea1254e402ed7969e3c206acde))
* add Rust syntax highlighter and CodeBlock component ([3c44081](https://github.com/Mearman/learn-rust/commit/3c440813c74a93f715005d214db03f3288db27e5))
* add six syntax reference topics (error handling, struct/class, enum/variant, pattern matching, generics, async) ([63f2b2a](https://github.com/Mearman/learn-rust/commit/63f2b2a5bfefe9367a2b99462c32cd2ca767dfbc))
* add standalone reference cards ([7af98d7](https://github.com/Mearman/learn-rust/commit/7af98d7da5c3bdc4f4cd51042ffd08acd6b6811c))
* add syntax tab for side-by-side language comparison ([09c5e35](https://github.com/Mearman/learn-rust/commit/09c5e356b8471a1ba754d4e6cc422ca20c1bc364))
* add theme colours and layout CSS ([85a1071](https://github.com/Mearman/learn-rust/commit/85a10718ca7c0398ec30b956c84ed3f50a74fbc8))
* add VE theme contract, sprinkles, and MantineProvider ([5f0b21b](https://github.com/Mearman/learn-rust/commit/5f0b21b21f6f0eb2b63c83929a3b42f7867ecb82))
* add Will it compile? challenge mode ([4df9386](https://github.com/Mearman/learn-rust/commit/4df9386ed2bf85ffd137f74034c2f4ea145b3f6f))
* animate sidebar groups and close the previous section on scroll ([6d3a30a](https://github.com/Mearman/learn-rust/commit/6d3a30afb9d2b1ac78bb2fb37c6c1ce8e3eb3c53))
* combine section sub-sections into a single collapsible sidebar tree ([5fe0084](https://github.com/Mearman/learn-rust/commit/5fe00845ea59f55802d95bf5d6c76314411cfa33))
* decouple cross-language data into four independent entities ([48782a5](https://github.com/Mearman/learn-rust/commit/48782a5b0a66b796f5c5db5a2e560f713e73d613))
* deep-link sections and entries via URL hash ([7bc2c27](https://github.com/Mearman/learn-rust/commit/7bc2c27b9b24ded221497f55d92a9284e735d3c9))
* defer render of Compare and Syntax section bodies until near-viewport ([44841f7](https://github.com/Mearman/learn-rust/commit/44841f788e9ccf25c4286e3e74fa6d4054f54c7a))
* flatten all subsections into infinite scroll ([8b1d73d](https://github.com/Mearman/learn-rust/commit/8b1d73dc0f07021fa1d03e0c52e514b4c1fd7534))
* handle raw/byte strings, doc comments and attributes in highlighter ([64b319d](https://github.com/Mearman/learn-rust/commit/64b319dbe4a236f428cf13b2603f4fd0ac33a2f4))
* link cheatsheet to standalone references ([f36fa5b](https://github.com/Mearman/learn-rust/commit/f36fa5bf0c27a653d93a140ccb17467d4634be6b))
* make language familiarity visible inline ([184099e](https://github.com/Mearman/learn-rust/commit/184099e03b5ddbc29614440019d40476da6672c3))
* make profile selections composable ([15757d5](https://github.com/Mearman/learn-rust/commit/15757d5530ecddd4d7b8ead7111f8f5cec6abe22))
* persist viewed lessons and challenge score ([186bbb9](https://github.com/Mearman/learn-rust/commit/186bbb9c299c1c51e3582138101deea1dd8c69b4))
* persistent auto/dark/light theme toggle ([3b954c2](https://github.com/Mearman/learn-rust/commit/3b954c2b595b1914c42d7be8f6788d392ab4e8e4))
* replace subsection scroller with sidebar TOC ([b33fa6f](https://github.com/Mearman/learn-rust/commit/b33fa6f2b30571ffb0fc892d90cf46af09d5a1e3))
* separate actual background from language familiarity ([5d3a2c4](https://github.com/Mearman/learn-rust/commit/5d3a2c4e64d51d87f83d1daf141caba552239c01))
* single search input, modal dialog semantics, and keyboard nav ([964be78](https://github.com/Mearman/learn-rust/commit/964be78c75cd0209a31b86dce24c5b81e7ae53db))
* single-scroll layout with sticky section nav ([3a18054](https://github.com/Mearman/learn-rust/commit/3a180548f39d1652814dbc3398a26bb4441a1b7b))
* sticky subsection navigation bar ([8130191](https://github.com/Mearman/learn-rust/commit/8130191b89661adb7916a14f166b79dc018184d0))
