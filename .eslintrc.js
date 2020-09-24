module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"rules": {
		"accessor-pairs": "error",
		"array-bracket-spacing": [
			"error",
			"never"
		],
		"array-callback-return": "error",
		"arrow-body-style": "error",
		"arrow-parens": "error",
		"arrow-spacing": "error",
		"block-scoped-var": "error",
		"block-spacing": "error",
		"brace-style": [
			"error",
			"1tbs"
		],
		"callback-return": "off",
		"camelcase": "error",
		"capitalized-comments": "off",
		"class-methods-use-this": "error",
		"comma-dangle": [
			"error",
			"never"
		],
		"comma-spacing": [
			"error",
			{
				"before": false,
				"after": true
			}
		],
		"comma-style": [
			"error",
			"last"
		],
		"complexity": [
			"error",
			{
				"max": 36
			}
		],
		"computed-property-spacing": [
			"error",
			"never"
		],
		"consistent-return": "off",
		"consistent-this": "off",
		"curly": "error",
		"default-case": "off",
		"dot-location": [
			"error",
			"property"
		],
		"dot-notation": "off",
		"eol-last": "off",
		"eqeqeq": "off",
		"func-call-spacing": [
			"error",
			"never"
		],
		"func-name-matching": "off",
		"func-names": "off",
		"func-style": "off",
		"generator-star-spacing": "error",
		"global-require": "error",
		"guard-for-in": "error",
		"handle-callback-err": "error",
		"id-blacklist": "error",
		"id-length": "off",
		"id-match": "error",
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
				"VariableDeclarator": 1,
				"CallExpression": {"arguments": 1}
			}
		],
		"init-declarations": "off",
		"jsx-quotes": "error",
		"key-spacing": [
			"error",
			{
				"afterColon": true
			}
		],
		"keyword-spacing": "error",
		"line-comment-position": "off",
		"linebreak-style": [
			"error",
			"unix"
		],
		"lines-around-comment": "off",
		"lines-around-directive": "off",
		"max-depth": "off",
		"max-len": "off",
		"max-lines": "off",
		"max-nested-callbacks": "error",
		"max-params": "off",
		"max-statements": "off",
		"max-statements-per-line": "off",
		"multiline-ternary": "off",
		"new-parens": "error",
		"newline-after-var": "error",
		"newline-before-return": "off",
		"newline-per-chained-call": "off",
		"no-alert": "error",
		"no-array-constructor": "error",
		"no-bitwise": "off",
		"no-caller": "error",
		"no-catch-shadow": "error",
		"no-cond-assign": [
			"error",
			"except-parens"
		],
		"no-confusing-arrow": "error",
		"no-console": [
			"error", {
				allow: ["warn", "error", "dir"]
			}
		],
		"no-continue": "off",
		"no-div-regex": "error",
		"no-duplicate-imports": "error",
		"no-else-return": "off",
		"no-empty": [
			"error",
			{
				"allowEmptyCatch": true
			}
		],
		"no-empty-function": "off",
		"no-eq-null": "error",
		"no-eval": "error",
		"no-extend-native": "error",
		"no-extra-bind": "error",
		"no-extra-label": "error",
		"no-extra-parens": "off",
		"no-floating-decimal": "error",
		"no-implicit-coercion": [
			"error",
			{
				"boolean": false,
				"number": false,
				"string": false
			}
		],
		"no-implicit-globals": "error",
		"no-implied-eval": "error",
		"no-inline-comments": "off",
		"no-inner-declarations": [
			"error",
			"functions"
		],
		"no-invalid-this": "off",
		"no-iterator": "error",
		"no-label-var": "error",
		"no-labels": "error",
		"no-lone-blocks": "error",
		"no-lonely-if": "off",
		"no-loop-func": "error",
		"no-magic-numbers": "off",
		"no-mixed-operators": "off",
		"no-mixed-requires": "off",
		//"no-mixed-space-and-tabs": "off",
		"no-multi-spaces": "error",
		"no-multi-str": "error",
		"no-multiple-empty-lines": "error",
		"no-native-reassign": "error",
		"no-negated-condition": "off",
		"no-negated-in-lhs": "error",
		"no-nested-ternary": "off",
		"no-new": "error",
		"no-new-func": "error",
		"no-new-object": "error",
		"no-new-require": "error",
		"no-new-wrappers": "error",
		"no-octal-escape": "error",
		"no-param-reassign": "off",
		"no-path-concat": "error",
		"no-plusplus": "off",
		"no-process-env": "off",
		"no-process-exit": "error",
		"no-proto": "error",
		"no-prototype-builtins": "off",
		"no-restricted-globals": "error",
		"no-restricted-imports": "error",
		"no-restricted-modules": "error",
		"no-restricted-properties": "error",
		"no-restricted-syntax": "error",
		"no-return-assign": "off",
		"no-return-await": "error",
		"no-script-url": "error",
		"no-self-compare": "off",
		"no-sequences": "off",
		"no-shadow": "off",
		"no-shadow-restricted-names": "off",
		"no-spaced-func": "off",
		"no-sync": "off",
		"no-tabs": "off",
		"no-template-curly-in-string": "error",
		"no-ternary": "off",
		"no-throw-literal": "off",
		"no-trailing-spaces": "error",
		"no-undef-init": "error",
		"no-undefined": "off",
		"no-underscore-dangle": "off",
		"no-unmodified-loop-condition": "off",
		"no-unneeded-ternary": "off",
		"no-unused-expressions": "off",
		"no-use-before-define": "off",
		"no-useless-call": "off",
		"no-useless-computed-key": "error",
		"no-useless-concat": "off",
		"no-useless-constructor": "error",
		"no-useless-escape": "off",
		"no-useless-rename": "error",
		"no-useless-return": "off",
		"no-var": "off",
		"no-void": "error",
		"no-warning-comments": "off",
		"no-whitespace-before-property": "error",
		"no-with": "error",
		"object-curly-newline": "off",
		"object-curly-spacing": "off",
		"object-property-newline": "off",
		"object-shorthand": "off",
		"one-var": "error",
		"one-var-declaration-per-line": [
			"error",
			"always"
		],
		"operator-assignment": "off",
		"operator-linebreak": [
			"error",
			"after"
		],
		"padded-blocks": "off",
		"prefer-arrow-callback": "off",
		"prefer-const": "error",
		"prefer-numeric-literals": "error",
		"prefer-reflect": "off",
		"prefer-rest-params": "off",
		"prefer-spread": "off",
		"prefer-template": "off",
		"quote-props": "off",
		"quotes": [
			"error",
			"double"
		],
		"radix": "off",
		"require-await": "error",
		"require-jsdoc": "off",
		"rest-spread-spacing": "error",
		"semi": "off",
		"semi-spacing": "off",
		"sort-imports": "error",
		"sort-keys": "off",
		"sort-vars": "off",
		"space-before-blocks": "error",
		"space-before-function-paren": [
			"error",
			{
				"anonymous": "always",
				"named": "never"
			}
		],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": [
			2, {
				"words": true,
				"overrides": {
					"new": false,
					"++": false
				}
			}
		],
		"spaced-comment": "off",
		"strict": "off",
		"symbol-description": "error",
		"template-curly-spacing": "error",
		"unicode-bom": [
			"error",
			"never"
		],
		"valid-jsdoc": "off",
		"valid-typeof": [
			"error",
			{
				"requireStringLiterals": false
			}
		],
		"vars-on-top": "error",
		"wrap-iife": [
			"error",
			"any"
		],
		"wrap-regex": "off",
		"yield-star-spacing": "error",
		"yoda": "off",
		"jsdoc/check-param-names": 1,
		"jsdoc/check-tag-names": 1,
		"jsdoc/check-types": 1,
		"jsdoc/newline-after-description": 0,
		"jsdoc/require-description-complete-sentence": 0,
		"jsdoc/require-hyphen-before-param-description": 0,
		"jsdoc/require-param": 0,
		"jsdoc/require-param-description": 0,
		"jsdoc/require-param-type": 1,
		"jsdoc/require-returns-description": 0,
		"jsdoc/require-returns-type": 1
	},
	"settings": {
		"jsdoc": {
			"tagNamePreference": {
				"returns": "return",
				"function": "method",
				"classdesc": "constructor"
			},
			"additionalTagNames": {
				"customTags": ["internal"]
			}
		}
	},
	"plugins": [
		"html",
		"jsdoc"
	],
	"globals": {
		"tizen": true
	},
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 8
	}
};
