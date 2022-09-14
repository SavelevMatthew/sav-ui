const { readdirSync } = require('fs')
const path = require('path')

const RELEASE_PACKAGES = ['packages/ui']

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const ignorePackages = getDirectories(path.join(__dirname, 'packages'))
    .map(folder => `packages/${folder}`)
    .filter(packageName => !RELEASE_PACKAGES.includes(packageName))

module.exports = {
    tagFormat: '${name}-v${version}',

}
