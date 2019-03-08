module.exports = {
	"env": {
		"browser": true,
		"node": true
	},
	"extends": "../.eslintrc.js",
	"rules": {
		"jsdoc/require-param-description": 1,
		"require-jsdoc": ["error", {
			"require": {
				"FunctionDeclaration": true,
				"MethodDefinition": true,
				"ClassDeclaration": true,
				"ArrowFunctionExpression": true
			}
		}],
		"complexity": [
			"error",
			{
				"max": 20
			}
		],
		"max-depth": [
			"error",
			{
				"max": 4
			}
		],
		"max-len": [
			"error",
			{
				"code": 120,
				"tabWidth": 4,
				"ignoreComments": true,
				"ignoreTrailingComments": true,
				"ignoreUrls": true,
				"ignoreStrings": true,
				"ignoreTemplateLiterals": true,
				"ignoreRegExpLiterals": true
			}
		],
		"max-params": [
			"error",
			{
				"max": 3
			}
		],
		"max-statements": [
			"error",
			{
				"max": 10
			}
		]
	}
};
