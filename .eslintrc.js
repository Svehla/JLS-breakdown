module.exports = {
  // USE REACT-APP ESLINT INSTEAD ONE IN THE PACKAGE.JSON ->
  // -> https://www.npmjs.com/package/eslint-config-react-app (but no real-time warnings)
  
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:react/recommended",
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    // "prettier/react", // NOT SURE?! WORKING? disables react-specific linting rules that conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    "semi": "off",
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": false,"variables": false, "typedefs": true }],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/class-name-casing": "error",
    "arrow-parens": ["error", "as-needed"],
    "no-use-before-define":  ["error", { "functions": false, "classes": false,"variables": false }],
    "prefer-arrow-callback": 1,
    "@typescript-eslint/ban-ts-ignore": 0,
    // because this rule is not working
    // "@typescript-eslint/explicit-member-accessibility": [ { accessibility: "no-public", overrides: { properties: "explicit" } } ],
    "@typescript-eslint/explicit-member-accessibility": 0, 
    // "comma-dangle": ["warn", "always-multiline"],
    "eqeqeq": "error",
    "max-len": ["warn", {"code": 100, "ignoreComments": true }],
    "new-parens": "error",
    "no-bitwise": "error",
    "no-console": ["warn", { allow: ["warn", "info", "error"] }],
    "no-caller": "error",
    "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
    "quote-props": ["error", "as-needed"],
    "sort-imports-es6-autofix/sort-imports-es6": [2, {
      "ignoreCase": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    }],
    "no-irregular-whitespace": "warn",
  },
  plugins: [
    "sort-imports-es6-autofix"
  ],
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}
