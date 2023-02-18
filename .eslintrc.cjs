module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/typescript',
  ],
  plugins: [
    '@typescript-eslint',
    'solid',
  ],
  ignorePatterns: [
    '*.cjs'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
}
