const UPSTREAM_URL = 'https://api.github.com/repos/eslint/json/contents/docs/rules';
const IGNORED_BASENAMES = new Set([ 'README', 'index' ]);

export function parseUpstreamRules(apiResponse) {
	if (!Array.isArray(apiResponse)) {
		return [];
	}

	return apiResponse
		.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
		.map((entry) => entry.name.replace(/\.md$/, ''))
		.filter((name) => !IGNORED_BASENAMES.has(name))
		.sort();
}

export async function fetchUpstreamRules() {
	const response = await fetch(UPSTREAM_URL, {
		headers: {
			'Accept': 'application/vnd.github+json',
			'User-Agent': 'sheplu-eslint-config-json-drift',
		},
	});

	if (!response.ok) {
		throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
	}

	return parseUpstreamRules(await response.json());
}

export function diffRules(configRuleNames, upstreamRuleNames) {
	const configRules = new Set(configRuleNames);
	const upstreamRules = new Set(upstreamRuleNames);
	const missing = [ ...upstreamRules ].filter((name) => !configRules.has(name));
	const extra = [ ...configRules ].filter((name) => !upstreamRules.has(name));

	return {
		configRules,
		extra,
		missing,
		upstreamRules,
	};
}
