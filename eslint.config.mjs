// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ========================================
  // IGNORE PATTERNS
  // ========================================
  {
    ignores: [
      'eslint.config.mjs',
      '.commitlintrc.js',
      'dist/',
      'node_modules/',
      'coverage/',
      '.husky/'
    ],
  },

  // ========================================
  // BASE CONFIGS
  // ========================================
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,

  // ========================================
  // MAIN PROJECT (src/, test/, emails/)
  // ========================================
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'emails/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        project: [
          './tsconfig.json',
        ],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': 'warn',
    },
  },
  
  // ========================================
  // SCRIPTS FOLDER (scripts/**/*.ts)
  // ========================================
  {
    files: ['scripts/**/*.ts', 'scripts/**/*.script.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.scripts.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'prettier/prettier': [
        'warn',
      ],
    },
  },
);