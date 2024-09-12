const path = require('path');

module.exports = {
  content: [
    path.resolve(__dirname, './public/**/*.html'),
    path.resolve(__dirname, './src/**/*.{js,jsx,ts,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
