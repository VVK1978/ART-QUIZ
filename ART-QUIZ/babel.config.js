module.exports = (api) => {
  api.cache.using(() => process.env.npm_lifecycle_event);

  const isDevelopment = process.env.npm_lifecycle_event === 'dev';

  return {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      isDevelopment && '@babel/plugin-proposal-class-properties',
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
        },
      ],
    ].filter(Boolean),
  };
};
