export const jsonRules = {
	rules: {
		"json/no-duplicate-keys": [
			"error",
		],
		"json/no-empty-keys": [
			"error",
		],
		"json/no-unnormalized-keys": [
			"error", {
				"form": "NFC",
			},
		],
		"json/no-unsafe-values": [
			"error",
		],
		"json/sort-keys": [
			"error", "asc", {
				"caseSensitive": true,
				"natural": true,
				"minKeys": 2,
				"allowLineSeparatedGroups": false,
			},
		],
		"json/top-level-interop": [
			"error",
		],
	},
};
