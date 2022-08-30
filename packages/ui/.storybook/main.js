const baseCssLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
    },
  },
  'postcss-loader',
]

const lessRule = {
  test: /\.less$/,
  use: [
    ...baseCssLoaders,
    'less-loader'
  ]
}

module.exports = {
  'stories': [
    '../src/stories/**/*.stories.mdx',
    '../src/stories/**/*.stories.@(ts|tsx)',
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
  ],
  'typescript': true,
  'framework': '@storybook/react',
  'core': {
    'builder': '@storybook/builder-webpack5',
  },
  'webpackFinal': async (config) => {
    const rules = config.module.rules.map(rule => {
      switch (String(rule.test)) {
        case String(/\.css$/):
          return {
            ...rule,
            use: baseCssLoaders
          }
        default:
          return rule
      }
    })

    rules.push(lessRule)

    return {
      ...config,
      resolve: {
        ...config.resolve,
        extensions: [
          ...config.resolve.extensions,
          '.less'
        ],
      },
      module: {
        ...config.module,
        rules,
      },
    }
  },
}