import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // build/ is generated; public/ holds vendored (minified) assets like capacitor.js.
  { ignores: ['build', 'node_modules', 'public'] },
  js.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Honor the `_` throwaway convention for both vars and args; also ignores the
      // (now-unneeded under the automatic JSX runtime) uppercase React import.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },
];
