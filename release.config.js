// Changelog config
const FEAT_SECTION = 'New Features'
const FIX_SECTION = 'Bug Fixes'
const PERF_SECTION = 'Performance Increases'
const OTHER_SECTION = 'Other'
const FEAT_TYPES = ['feat']
const FIX_TYPES = ['fix', 'hotfix']
const PERF_TYPES = ['perf']
const OTHER_TYPES = ['docs', 'style', 'refactor', 'test', 'build', 'ci', 'chore', 'revert']
// Release config (extends
const MINOR_RELEASE_TYPES = ['feat']
const PATCH_RELEASE_TYPES = ['fix', 'hotfix', 'revert', 'perf']
// Rest types will go no-release by default


const generateTypesChangelog = (sectionName, commitTypes) => {
    return commitTypes.map(commitType => ({ section: sectionName, type: commitType, hidden: false }))
}

const generateTypesRules = (commitTypes, release) => {
    return commitTypes.map(commitType => ({ type: commitType, release }))
}

const basicConventionalConfig = {
    preset: 'conventionalcommits',
    presetConfig: {
        types: [
            ...generateTypesChangelog(FEAT_SECTION, FEAT_TYPES),
            ...generateTypesChangelog(FIX_SECTION, FIX_TYPES),
            ...generateTypesChangelog(PERF_SECTION, PERF_TYPES),
            ...generateTypesChangelog(OTHER_SECTION, OTHER_TYPES),
        ],
    },
}

const conventionalChangelogConfig = basicConventionalConfig

const conventionalAnalyzerConfig = {
    ...basicConventionalConfig,
    releaseRules: [
        ...generateTypesRules(MINOR_RELEASE_TYPES, 'minor'),
        ...generateTypesRules(PATCH_RELEASE_TYPES, 'patch'),
    ],
}


module.exports = {
    extends: ['semantic-release-monorepo'],
    branches: [
        'main',
    ],
    plugins: [
        ['@semantic-release/commit-analyzer', conventionalAnalyzerConfig],
        ['@semantic-release/release-notes-generator', conventionalChangelogConfig],
        [
            '@semantic-release/npm',
            { npmPublish: false },
        ],
        [
            '@semantic-release/exec',
            {
                publishCmd: 'yarn install --mode update-lockfile && yarn build && yarn npm publish',
            },
        ],
    ],
}