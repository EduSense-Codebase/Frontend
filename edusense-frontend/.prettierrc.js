// .prettierrc.js

/** @type {import("prettier").Config} */
module.exports = {
  semi: true, // Add semicolons at the ends of statements
  singleQuote: true, // Use single quotes instead of double quotes
  trailingComma: 'all', // Print trailing commas wherever possible in multi-line code
  printWidth: 100, // Wrap lines longer than 100 characters
  tabWidth: 4, // Indent lines with 2 spaces
  useTabs: false, // Use spaces instead of tabs
  bracketSpacing: true, // Print spaces between brackets in object literals
  arrowParens: 'always', // Always include parens for arrow function params
  jsxSingleQuote: false, // Use double quotes in JSX
  endOfLine: 'lf', // Maintain existing line endings (for cross-platform compatibility)
  plugins: ['prettier-plugin-tailwindcss'], // Optional: sorts Tailwind classes if you're using Tailwind
};