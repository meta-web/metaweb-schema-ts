/*
 * metaweb-schema-ts
 *
 * META Schema parser, analyzer, compiler and runtime.
 *
 * @package metaweb-schema-ts
 * @copyright 2020 Jiri Hybek <jiri@hybek.cz> and META Web contributors.
 * @license Apache-2.0
 *
 * See LICENSE file distributed with this source code for more information.
 */

import * as Moo from "moo";

/**
 * Keywords
 */
export const keywords = {
	import: "import",
	use: "use",
	namespace: "namespace",
	schema: "schema",
	type: "type",
	translation: "translation",
	extends: "extends",
	let: "let",
	state: "state",
	propagate: "propagate",
	inherit: "inherit",
	action: "action",
	override: "override",
	update: "update",
	invoke: "invoke",
	return: "return",
	fn: "fn",
	when: "when",
	then: "then",
	else: "else",
	is: "is",
	not: "not",
	and: "and",
	or: "or",
	true: "true",
	false: "false",
	null: "null"
};

/**
 * Moo configured tokens
 */
export const lexerStates = {
	main: {
		ws: /[ \t]+/,
		nl: { match: "\n", lineBreaks: true },
		comment: /\/\/.*?$/,
		commentOpen: /\/\*/,
		commentClose: /\*\//,
		lte: "<=",
		lt: "<",
		gte: ">=",
		gt: ">",
		eq: "==",
		neq: "!=",
		not: "!",
		paranOpen: "(",
		paranClose: ")",
		comma: ",",
		dot: ".",
		bracketOpen: "[",
		bracketClose: "]",
		braceOpen: {
			match: "{",
			push: "main"
		},
		braceClose: {
			match: "}",
			pop: 1
		},
		arrow: "=>",
		assignment: "=",
		hash: "#",
		plus: "+",
		minus: "-",
		multiply: "*",
		divide: "/",
		modulo: "%",
		colon: ":",
		semicolon: ";",
		questionmark: "?",
		or: "||",
		pipe: "|",
		and: "&&",
		amp: "&",
		attribute: "@",
		dollar: "$",
		tilda: "~",
		string_template: {
			match: "`",
			push: 'string_template'
		},
		string_literal: {
			match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
			value: s => JSON.parse(s)
		},
		number_literal: {
			match: /[0-9]+(?:\.[0-9]+)?/,
			value: s => Number(s) as any
		},
		identifier: {
			match: /[a-zA-Z_][a-zA-Z_0-9]*/,
			type: Moo.keywords(keywords)
		},
		char: {
			match: /./
		}
	} as Moo.Rules,
	string_template: {
		escape: /\\./,
		interpolation: {
			match: '${',
			push: "main"
		},
		strend: {
			match: "`",
			pop: 1
		},
		const: {
			match: /(?:[^$`\\]|\\?\$(?!\{))+/,
			lineBreaks: true
		},
	} as Moo.Rules
};

/**
 * Built-in schemas
 */
export const builtinSchemas = {
	lt: { ns: [ "Meta", "Compare" ], id: "lt" },
	lte: { ns: [ "Meta", "Compare" ], id: "lte" },
	gt: { ns: [ "Meta", "Compare" ], id: "gt" },
	gte: { ns: [ "Meta", "Compare" ], id: "gte" },
	equal: { ns: [ "Meta", "Logic" ], id: "equal" },
	notEqual: { ns: [ "Meta", "Logic" ], id: "notEqual" },
	and: { ns: [ "Meta", "Logic" ], id: "and" },
	or: { ns: [ "Meta", "Logic" ], id: "or" },
	not: { ns: [ "Meta", "Logic" ], id: "not" },
	multiply: { ns: [ "Meta", "Arithmetic" ], id: "multiply" },
	divide: { ns: [ "Meta", "Arithmetic" ], id: "divide" },
	sum: { ns: [ "Meta", "Arithmetic" ], id: "sum" },
	sub: { ns: [ "Meta", "Arithmetic" ], id: "sub" },
	modulo: { ns: [ "Meta", "Arithmetic" ], id: "modulo" },
	concat: { ns: [ "Meta" ], id: "concat" }
};

/**
 * Built-in types
 */
export const builtinTypes = {
	String: { ns: ["Meta"], id: "String" },
	Number: { ns: ["Meta"], id: "Number" },
	Integer: { ns: ["Meta"], id: "Integer" },
	Float: { ns: ["Meta"], id: "Float" },
	Boolean: { ns: ["Meta"], id: "Boolean" },
	Date: { ns: ["Meta"], id: "Date" },
	Null: { ns: ["Meta"], id: "Null" }
}