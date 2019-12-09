module.exports = {
    "env": {
        "browser": false,
        "commonjs": true,
        "es6": true
    },
    "extends": "airbnb-base/legacy",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "context": "readonly",
        "process": "readonly",
        "console": "readonly",
    },
    "parserOptions": {
        "ecmaVersion": 2019
    },
	"rules": {
        'no-tabs': 0,
        'indent': ['error', 'tab'],
		'no-console': 'warn',
		'comma-dangle': [
			'warn',
			'never'
        ],
		'linebreak-style': [
			'warn',
			'unix'
		],
		'semi': [
			'error',
			'always',
			{ 'omitLastInOneLineBlock': true}
		],
		"block-scoped-var": "error",
		"consistent-return": "error",
	}
};