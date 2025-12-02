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
