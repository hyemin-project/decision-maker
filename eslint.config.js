import { Linter } from 'eslint';
import globals from 'globals';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import babelParser from '@babel/eslint-parser';

export default [
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        //grecaptcha: 'readonly'  // This tells ESLint that `grecaptcha` is a global variable that should not be overwritten
      },
      rserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            '@babel/plugin-syntax-jsx',
          ],
        },
      },
      parser: babelParser,
    },
    plugins: {
      vue,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
];
