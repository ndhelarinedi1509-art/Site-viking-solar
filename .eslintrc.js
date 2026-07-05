const { resolve } = require('path');

module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
  },
};
