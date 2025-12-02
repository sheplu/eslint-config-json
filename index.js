import { jsonRules } from "./eslint-json";

export const JsonRules = [
	{
		rules: {
			...jsonRules.rules,
		},
	},
];

export const defaultJsonConfig = {
	'files': ['**/*.json'],
	'plugins': { json },
	'language': 'json/json',
	'extends': [jsonRules],
};

export const defaultJsoncConfig = {
	'files': ['**/*.jsonc'],
	'plugins': { json },
	'language': 'json/jsonc',
	'extends': [jsonRules],
};
