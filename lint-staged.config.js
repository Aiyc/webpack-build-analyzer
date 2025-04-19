/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '!(src/*.{ts,js})': 'prettier --write',
  '(src/*.{js,ts})': ['eslint --fix'],
};
