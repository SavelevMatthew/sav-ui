module.exports = {
    source: ['tokens/sets/*.json'],
    platforms: {
        css: {
            transformGroup: 'css',
            prefix: 'condo',
            buildPath: 'tokens/',
            files: [
                {
                    destination: 'variables.css',
                    format: 'css/variables',
                },
            ],
        },
    },
}