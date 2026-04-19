module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Resolve @/ path alias at Metro runtime (same as tsconfig paths)
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
        },
      ],
      // Required for react-native-reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
