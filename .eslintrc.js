module.exports = {
  extends: ['./base.js'],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
    indent: [2, 2],
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
}
