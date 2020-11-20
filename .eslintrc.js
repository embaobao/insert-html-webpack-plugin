module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'eslint:recommended',
  ],
  globals: {
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
}
