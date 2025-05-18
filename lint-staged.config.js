/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
  '!(src/*.{ts,js})': 'prettier --write',
  '(src/*.{js,ts})': ['eslint --fix'],
};
