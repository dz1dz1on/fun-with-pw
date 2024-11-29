import eslint from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['**/*.js', 'node_modules/', 'playwright-report/', 'playwright.config.ts'],
	},
	eslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				window: 'readonly',
				global: 'writable',
				document: 'readonly',
				console: 'readonly',
				setTimeout: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': 'off',
			'no-undef': 'off',
		},
	},
	{
		files: ['**/*.ts', '*.ts'],
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true,
			},
		},
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-inferrable-types': 'warn',
			'@typescript-eslint/member-ordering': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{
		plugins: {
			playwright: playwright,
		},
		rules: {
			'playwright/expect-expect': 'off',
			'playwright/no-skipped-test': 'off',
			'playwright/no-page-pause': 'error',
			'playwright/no-conditional-in-test': 'off',
			'playwright/no-focused-test': 'error',
		},
	}
);
