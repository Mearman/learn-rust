import type { Options } from "semantic-release";

/**
 * semantic-release configuration. This is a private, non-published app
 * (deployed to GitHub Pages), so there is no npm publish step. Releases
 * derive a version from Conventional Commits and produce a git tag, a
 * GitHub Release with generated notes, and an updated CHANGELOG.md
 * committed back to the repository.
 */
const config: Options = {
    branches: ["main"],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
        // Bumps the version in package.json without publishing to any
        // registry — this app is private and not distributed via npm.
        ["@semantic-release/npm", { npmPublish: false }],
        "@semantic-release/github",
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "package.json"],
                // semantic-release interpolates these tokens itself, so they
                // are literal characters in a plain string, not a JS template.
                message:
                    "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
        ],
    ],
};

export default config;
