import { defineConfig } from 'eslint/config';
import markdownRules from '@sheplu/eslint-config/src/markdown.js';
import globals from 'globals';
import js from '@eslint/js';
import markdown from '@eslint/markdown';
import stylistic from '@stylistic/eslint-plugin';
import stylisticRules from '@sheplu/eslint-config/src/stylistic.js';

export default defineConfig([
	{
		'extends': [
			'js/recommended',
			// eslintRules,
			stylisticRules,
		],
		'files': [ '**/*.{js,mjs,cjs}' ],
		'languageOptions': {
			globals: globals.node,
		},

		'plugins': { '@stylistic': stylistic, js },
		'rules': {
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
]);
