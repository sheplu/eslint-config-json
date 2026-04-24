import {
	defaultJson5Config,
	defaultJsonConfig,
	defaultJsoncConfig,
} from './index.js';
import { defineConfig } from 'eslint/config';
import { markdownRules } from '@sheplu/eslint-config/src/markdown.js';
import globals from 'globals';
import js from '@eslint/js';
import markdown from '@eslint/markdown';
import stylistic from '@stylistic/eslint-plugin';
import stylisticRules from '@sheplu/eslint-config/src/stylistic.js';

export default defineConfig([
	{
		ignores: [
			'**/package.json',
			'**/package-lock.json',
			'**/apkg.json',
			'**/apkg-lock.json',
		],
	},
	{
		'extends': [
			'js/recommended',
			stylisticRules,
		],
		'files': [ '**/*.{js,mjs,cjs}' ],
		'languageOptions': {
			globals: globals.node,
		},
		'plugins': { '@stylistic': stylistic, js },
		'rules': {
			'@stylistic/curly-newline': 'warn',
		},
	},
	{
		'files': [ '**/*.md' ],
		'plugins': { markdown },
		'language': 'markdown/gfm',
		'extends': [ markdownRules ],
		'languageOptions': {
			frontmatter: 'yaml',
		},
	},
	defaultJsonConfig,
	defaultJsoncConfig,
	defaultJson5Config,
]);
