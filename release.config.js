// Release notes config
const FEAT_SECTION_NAME = '✨ New Features'
const FEAT_SECTION_TYPES = ['feat']
const FIX_SECTION_NAME = '🐛 Bug Fixes'
const FIX_SECTION_TYPES = ['fix', 'hotfix']
const PERF_SECTION_NAME = '🚀 Performance Improvements'
const PERF_SECTION_TYPES = ['perf']
const OTHER_SECTION_NAME = '🦖 Other Changes'
const OTHER_SECTION_TYPES = ['docs', 'style', 'refactor', 'test', 'build', 'ci', 'chore', 'revert']

// Release type config
const MINOR_RELEASE_TYPES = ['feat']
const PATCH_RELEASE_TYPES = ['fix', 'hotfix', 'revert', 'perf']
// Rest types will go no-release by default

const generateSectionRules = (sectionName, commitTypes) => {
    return commitTypes.map(commitType => ({ section: sectionName, type: commitType, hidden: false }))
}
const generateReleaseRules = (release, commitTypes) => {
    return commitTypes.map(commitType => ({ type: commitType, release }))
}

const basicConventionalConfig = {
    preset: 'conventionalcommits',
    presetConfig: {
        types: [
            ...generateSectionRules(FEAT_SECTION_NAME, FEAT_SECTION_TYPES),
            ...generateSectionRules(FIX_SECTION_NAME, FIX_SECTION_TYPES),
            ...generateSectionRules(PERF_SECTION_NAME, PERF_SECTION_TYPES),
            ...generateSectionRules(OTHER_SECTION_NAME, OTHER_SECTION_TYPES),
        ],
    },
}

const conventionalChangelogConfig = {
    ...basicConventionalConfig,
}


const conventionalAnalyzerConfig = {
    ...basicConventionalConfig,
    releaseRules: [
        ...generateReleaseRules('minor', MINOR_RELEASE_TYPES),
        ...generateReleaseRules('patch', PATCH_RELEASE_TYPES),
        { breaking: true, release: 'major' },
    ],
    parserOpts: {
        noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING-CHANGE', 'BREAKING-CHANGES'],
    },
}

module.exports = {
    branches: ['main'],
    extends: ['semantic-release-monorepo'],
    plugins: [
        ['@semantic-release/commit-analyzer', conventionalAnalyzerConfig],
        ['@semantic-release/release-notes-generator', conventionalChangelogConfig],
        ['@semantic-release/npm'],
        // ['@condo/yarn'],
        // '@semantic-release/github',
    ],
}