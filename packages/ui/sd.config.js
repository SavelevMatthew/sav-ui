module.exports = {
    source: ['src/tokens/sets/*.json'],
    platforms: {
        css: {
            transformGroup: 'css',
            prefix: 'condo',
            buildPath: 'src/tokens/',
            files: [
                {
                    destination: 'variables.css',
                    format: 'css/variables',
                },
            ],
        },
    },
}