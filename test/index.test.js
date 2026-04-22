import {
	defaultJson5Config,
	defaultJsonConfig,
	defaultJsoncConfig,
	jsonRules,
} from '../index.js';
import { describe, it } from 'node:test';
import {
	diffRules,
	fetchUpstreamRules,
	parseUpstreamRules,
} from './review-rules.js';
import assert from 'node:assert/strict';
import json from '@eslint/json';
import { jsonRules as sourceJsonRules } from '../eslint-json.js';

const validSeverities = new Set([
	'off',
	'warn',
	'error',
]);

function isValidSeverity(value) {
	if (Array.isArray(value)) {
		const [ severity ] = value;

		return Boolean(value.length) && validSeverities.has(severity);
	}

	return validSeverities.has(value);
};

const stripPrefix = (name) => name.replace(/^json\//, '');

describe('jsonRules export shape', () => {
	it('is a non-empty array with a single config object', () => {
		const expectedLength = 1;

		assert.ok(Array.isArray(jsonRules));
		assert.equal(jsonRules.length, expectedLength);
	});

	it('exposes a non-empty rules object', () => {
		const [ { rules } ] = jsonRules;

		assert.equal(typeof rules, 'object');
		assert.notEqual(rules, null);
		assert.ok(Object.keys(rules).length);
	});
});

describe('default config exports', () => {
	const cases = [
		[
			'defaultJsonConfig',
			defaultJsonConfig,
			'**/*.json',
			'json/json',
		],
		[
			'defaultJsoncConfig',
			defaultJsoncConfig,
			'**/*.jsonc',
			'json/jsonc',
		],
		[
			'defaultJson5Config',
			defaultJson5Config,
			'**/*.json5',
			'json/json5',
		],
	];

	for (const caseEntry of cases) {
		const [
			label,
			config,
			glob,
			language,
		] = caseEntry;

		describe(label, () => {
			it('targets the expected glob', () => {
				assert.deepEqual(config.files, [ glob ]);
			});

			it('declares the matching language', () => {
				assert.equal(config.language, language);
			});

			it('registers the @eslint/json plugin by identity', () => {
				assert.equal(config.plugins.json, json);
			});

			it('extends jsonRules by identity', () => {
				assert.equal(config.extends[0], jsonRules);
			});

			it('exposes exactly files/plugins/language/extends keys', () => {
				assert.deepEqual(Object.keys(config).sort(), [
					'extends',
					'files',
					'language',
					'plugins',
				]);
			});
		});
	}
});

describe('rule severities', () => {
	it('every rule uses a string severity (off/warn/error), not a numeric one', () => {
		const [ { rules } ] = jsonRules;
		const invalid = Object.entries(rules)
			.filter(([ , value ]) => !isValidSeverity(value))
			.map(([ name ]) => name);

		assert.deepEqual(invalid, []);
	});

	it('isValidSeverity accepts string forms and array forms starting with them', () => {
		assert.equal(isValidSeverity('off'), true);
		assert.equal(isValidSeverity('warn'), true);
		assert.equal(isValidSeverity('error'), true);
		assert.equal(isValidSeverity([ 'error' ]), true);
		assert.equal(isValidSeverity([ 'error', { option: true } ]), true);
	});

	it('isValidSeverity rejects numeric forms and unknown strings', () => {
		const off = 0;
		const warn = 1;
		const error = 2;
		const numericSeverities = [
			off,
			warn,
			error,
		];

		numericSeverities.forEach((severity) => {
			assert.equal(isValidSeverity(severity), false);
			assert.equal(isValidSeverity([ severity ]), false);
		});

		assert.equal(isValidSeverity('bogus'), false);
		assert.equal(isValidSeverity([]), false);
	});
});

describe('rule names are unique & well-formed', () => {
	it('every rule name is prefixed with json/', () => {
		const names = Object.keys(sourceJsonRules.rules);
		const unprefixed = names.filter((name) => !name.startsWith('json/'));

		assert.deepEqual(unprefixed, []);
	});

	it('rule names are unique within the source module', () => {
		const names = Object.keys(sourceJsonRules.rules);

		assert.equal(names.length, new Set(names).size);
	});

	it('index.js and eslint-json.js expose the same rule names', () => {
		const [ { rules: exported } ] = jsonRules;

		assert.deepEqual(
			Object.keys(exported).sort(),
			Object.keys(sourceJsonRules.rules).sort(),
		);
	});
});

describe('installed plugin drift (offline)', () => {
	it('every configured rule exists in the installed @eslint/json plugin', () => {
		const pluginRules = Object.keys(json.rules);
		const configRules = Object.keys(sourceJsonRules.rules).map(stripPrefix);
		const { missing, extra } = diffRules(configRules, pluginRules);

		assert.deepEqual(extra, [], `Extra in config (removed upstream?): ${extra.join(', ')}`);
		assert.deepEqual(missing, [], `Missing from config: ${missing.join(', ')}`);
	});
});

describe('upstream rule parser', () => {
	it('returns only .md file basenames, skipping directories and README', () => {
		const response = [
			{ name: 'no-duplicate-keys.md', type: 'file' },
			{ name: 'README.md', type: 'file' },
			{ name: 'nested', type: 'dir' },
			{ name: 'sort-keys.md', type: 'file' },
			{ name: 'notes.txt', type: 'file' },
		];

		assert.deepEqual(parseUpstreamRules(response), [
			'no-duplicate-keys',
			'sort-keys',
		]);
	});

	it('returns an empty array when given an empty list', () => {
		assert.deepEqual(parseUpstreamRules([]), []);
	});

	it('returns an empty array when no entry is a markdown file', () => {
		const response = [
			{ name: 'index.html', type: 'file' },
			{ name: 'scripts', type: 'dir' },
		];

		assert.deepEqual(parseUpstreamRules(response), []);
	});

	it('returns an empty array when given a non-array (e.g. error payload)', () => {
		assert.deepEqual(parseUpstreamRules({ message: 'Not Found' }), []);
	});
});

describe('diffRules', () => {
	it('returns empty missing/extra for identical sets', () => {
		const { missing, extra } = diffRules([ 'a', 'b' ], [ 'a', 'b' ]);

		assert.deepEqual(missing, []);
		assert.deepEqual(extra, []);
	});

	it('detects a rule missing from the config (upstream added a new rule)', () => {
		const { missing, extra } = diffRules([ 'a' ], [ 'a', 'b-new' ]);

		assert.deepEqual(missing, [ 'b-new' ]);
		assert.deepEqual(extra, []);
	});

	it('detects an extra rule in the config (upstream removed a rule)', () => {
		const { missing, extra } = diffRules([ 'a', 'b-removed' ], [ 'a' ]);

		assert.deepEqual(missing, []);
		assert.deepEqual(extra, [ 'b-removed' ]);
	});

	it('detects a renamed rule as one missing + one extra', () => {
		const { missing, extra } = diffRules([ 'a', 'b-old' ], [ 'a', 'b-new' ]);

		assert.deepEqual(missing, [ 'b-new' ]);
		assert.deepEqual(extra, [ 'b-old' ]);
	});

	it('deduplicates names via Set semantics', () => {
		const uniqueCount = 2;
		const { configRules, upstreamRules } = diffRules([
			'a',
			'a',
			'b',
		], [
			'a',
			'b',
			'b',
		]);

		assert.equal(configRules.size, uniqueCount);
		assert.equal(upstreamRules.size, uniqueCount);
	});
});

describe('upstream rules match config', () => {
	it('all upstream eslint/json rules are present in the config', async () => {
		const fetched = await fetchUpstreamRules();
		const configRules = Object.keys(sourceJsonRules.rules).map(stripPrefix);
		const { missing, extra } = diffRules(configRules, fetched);

		assert.deepEqual(missing, [], `Missing from config: ${missing.join(', ')}`);
		assert.deepEqual(extra, [], `Extra in config (removed upstream?): ${extra.join(', ')}`);
	});
});
