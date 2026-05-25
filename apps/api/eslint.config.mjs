// @ts-check
import eslint from '@eslint/js';
import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'generated/**', 'coverage/**', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...eslintNestJs.configs.flatRecommended,
  ...eslintNestJs.configs.flatNoSwagger,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-duplicate-imports': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@darraghor/nestjs-typed/injectable-should-be-provided': [
        'error',
        {
          src: ['src/**/*.ts'],
          filterFromPaths: ['node_modules', '.test.', '.spec.', 'generated'],
        },
      ],
      '@darraghor/nestjs-typed/validated-non-pipe-param-should-be-provided': 'off',
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/use-cases/**/*.ts'],
    rules: {
      '@darraghor/nestjs-typed/injectable-should-be-provided': 'off',
    },
  },
);
