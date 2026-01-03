import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { jsonRules } from '../eslint-json.js';

describe('Rules', () => {
	it('has the same number of rules', () => {
		const fetchedRules = readdirSync('./remote/docs/rules').length;
		const rules = Object.keys(jsonRules.rules).length;

		assert.equal(rules, fetchedRules);
	});

	it('has the same rules', () => {
		const fetchedRules = readdirSync('./remote/docs/rules')
			.map((item) => item.replace('.md', ''))
			.filter((item) => item !== 'fenced-code-meta');
		const rules = Object.keys(jsonRules.rules)
			.map((item) => item.replace('json/', ''));

		assert.deepEqual(rules, fetchedRules);
	});
});
