const { spawn } = require('child_process')
const path = require('path')
const get = require('lodash/get')
const fs = require('fs')
const tokens = require('../src/tokens/tokens.json')

/**
 * Split single token file to multiple sets by namespaces and stores them inside tokens/sets dir
 */
function splitTokenSets () {
    // Get token sets
    const tokenSets = get(tokens, ['$metadata', 'tokenSetOrder'], [])

    if (!tokenSets.length) {
        throw new Error('Traverse order was not defined!')
    }

    // Process all tokens to resolve references
    const setsToParse = tokenSets.join(',')

    // But exclude all except one for specific token set
    for (let i = 0; i < tokenSets.length; i++) {
        const setName = tokenSets[i]
        const setsToExclude = tokenSets.slice(0, i).concat(tokenSets.slice(i + 1, tokenSets.length)).join(',')

        // Generate separate resolved token set
        const childProcess = spawn('yarn', [
            'workspace',
            '@savelevmatthew/ui',
            'token-transformer',
            'src/tokens/tokens.json',
            `src/tokens/sets/${setName}.json`,
            setsToParse,
            setsToExclude,
            '--expandTypography',
        ])

        // Wrap entire set with namespace name
        childProcess.on('exit', code => {
            if (code === 0) {
                const fileName = path.join(__dirname, `../src/tokens/sets/${setName}.json`)
                const file = require(fileName)
                fs.writeFileSync(fileName, JSON.stringify({
                    [setName]: file,
                }, null, 2))
                console.log(`Set ${setName} is wrapped`)
            }
        })
    }

}

splitTokenSets()

