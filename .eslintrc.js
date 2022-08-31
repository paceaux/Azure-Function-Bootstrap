module.exports = {
	ignorePatterns: [
		'node_modules'
	],
	env: {
		browser: false,
		commonjs: true,
		es2022: true,
		jest: true
	},
	extends: 'airbnb-base',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
		context: 'readonly',
		process: 'readonly',
		console: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-tabs': 0,
		indent: ['error', 'tab'],
		'no-console': 'warn',
		'comma-dangle': [
			'warn',
			'never'
		],
		'linebreak-style': [
			'warn',
			'unix'
		],
		semi: [
			'error',
			'always',
			{ omitLastInOneLineBlock: true }
		],
		'block-scoped-var': 'error',
		'consistent-return': 'error'
	}
};
