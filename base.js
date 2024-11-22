module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
		commonjs: true,
		jest: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'linebreak-style': ['off', 'windows'],
		'import/order': [
			'warn',
			{
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
					'unknown',
					'object',
					'type',
				],
				alphabetize: { order: 'asc', caseInsensitive: true },
				pathGroups: [
					{
						pattern: '@/**',
						group: 'internal',
					},
					{
						pattern: '@raft/**',
						group: 'internal',
					},
					{
						pattern: 'react',
						group: 'external',
					},
				],
				pathGroupsExcludedImportTypes: ['react'],
			},
		],
	},
	ignorePatterns: ['dist', 'coverage', 'src/legacy/**'],
	overrides: [
		{
			files: ['*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/no-require-imports': 'off',
				indent: ['off', 2],
			},
		},
	],
}
