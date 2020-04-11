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

import { IParseContext } from "../IParseContext";
import { IParseMatchRule } from "../IParseMatchRule";
import { Parser } from "../Parser";
import { CMPL_ITEM_KIND } from "../../Shared/ICompletionItem";
import { IASTSchemaImport } from "../../AST/IASTSchemaImport";
import { IASTSchemaUse } from "../../AST/IASTSchemaUse";
import { AutocompleteIdentifier } from "../Autocomplete";
import { tokenToPosition, tokenToRange } from "../ParserUtil";
import { keywords, builtinSchemas, builtinTypes } from "../ParserConsts";
import {
	opt, expect, e, accept,
	anyUntil, seq, expectOneOf, repeatUntil, repeatSince, oneOf, block, list, repeat, startsWith, expectBlock, tryParse
} from "./GrammarUtil";

import {
	AST_NODE_TYPES,
	IASTSchemaDocument,
	IASTSchemaNamespace,
	IASTSchemaType,
	IASTSchemaTypeOneOf,
	IASTSchemaTypeAllOf,
	IASTSchemaRefType,
	IASTSchemaTypeStruct,
	IASTSchemaGeneric, IASTSchemaGenericList,
	IASTSchemaTypeParameterList,
	IASTSchema,
	IASTSchemaVariable,
	IASTSchemaUpdate,
	IASTSchemaRefVariable,
	IASTSchemaInvoke,
	IASTSchemaAction,
	IASTSchemaLambda,
	IASTSchemaConditionElement,
	IASTSchemaCondition,
	TASTSchemaExpression,
	IASTSchemaRefParam,
	IASTSchemaRefProperty,
	IASTSchemaConst,
	IASTSchemaCall,
	IASTSchemaCallArgument,
	IASTSchemaValueList,
	IASTSchemaValueStruct,
	ISchemaRefTranslation,
	IASTSchemaConditionType,
	IASTSchemaRefSchema,
	IASTSchemaTranslation,
	IASTSchemaTranslationTerm,
	IASTSchemaRefAction
} from "../../AST";
import { IASTSchemaParamList, IASTSchemaParam } from "../../AST/IASTSchemaParams";
import { IASTSchemaReturn } from "../../AST/IASTSchemaReturn";
import { DOC_ERROR_SEVERITY } from "../../Shared/IDocumentError";

/*
 * WILDCARDS
 */
const AnyToken : IParseMatchRule = {
	label: "any",
	match: (token) => true
};

/*
 * KEYWORDS
 */
const KeywordImport : IParseMatchRule = {
	label: "import",
	hint: "Import another script.",
	match: (token) => token.type === "import",
	autocomplete: () => [{
		label: "import",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Import another script.;",
	}]
};

const KeywordUse : IParseMatchRule = {
	label: "use",
	hint: "Use identifiers from a different namespace.",
	match: (token) => token.type === "use",
	autocomplete: () => [{
		label: "use",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Use identifiers from a different namespace."
	}]
};

const KeywordNamespace : IParseMatchRule = {
	label: "namespace",
	hint: "Declare namespace.",
	match: (token) => token.type === "namespace",
	autocomplete: () => [{
		label: "namespace",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declare namespace."
	}]
};

const KeywordType : IParseMatchRule = {
	label: "type",
	hint: "Declare type.",
	match: (token) => token.type === "type",
	autocomplete: () => [{
		label: "type",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declare type."
	}]
};

const KeywordSchema : IParseMatchRule = {
	label: "schema",
	hint: "Declare schema.",
	match: (token) => token.type === "schema",
	autocomplete: () => [{
		label: "schema",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declare schema."
	}]
};

const KeywordTranslation : IParseMatchRule = {
	label: "translation",
	hint: "Declare translation.",
	match: (token) => token.type === "translation",
	autocomplete: () => [{
		label: "translation",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declare translation."
	}]
};

const KeywordExtends : IParseMatchRule = {
	label: "extends",
	hint: "Extends another type.",
	match: (token) => token.type === "extends",
	autocomplete: () => [{
		label: "extends",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Extends another type."
	}]
};

const KeywordLet : IParseMatchRule = {
	label: "let",
	hint: "Declares a variable.",
	match: (token) => token.type === "let",
	autocomplete: () => [{
		label: "let",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declares a variable."
	}]
};

const KeywordState : IParseMatchRule = {
	label: "state",
	hint: "Set variable as statefull.",
	match: (token) => token.type === "state",
	autocomplete: () => [{
		label: "state",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Set variable as statefull."
	}]
};

const KeywordPropagate : IParseMatchRule = {
	label: "propagate",
	hint: "Set variable as propagated.",
	match: (token) => token.type === "propagate",
	autocomplete: () => [{
		label: "propagate",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Set variable as propagated."
	}]
};

const KeywordInherit : IParseMatchRule = {
	label: "inherit",
	hint: "Set variable as inherited.",
	match: (token) => token.type === "inherit",
	autocomplete: () => [{
		label: "inherit",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Set variable as inherited."
	}]
};

const KeywordAction : IParseMatchRule = {
	label: "action",
	hint: "Declares an action.",
	match: (token) => token.type === "action",
	autocomplete: () => [{
		label: "action",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declares an action."
	}]
};

const KeywordOverride : IParseMatchRule = {
	label: "override",
	hint: "Declares an overrided action.",
	match: (token) => token.type === "override",
	autocomplete: () => [{
		label: "override",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declares an overrided action."
	}]
};

const KeywordReturn : IParseMatchRule = {
	label: "return",
	hint: "Declares a return expression.",
	match: (token) => token.type === "return",
	autocomplete: () => [{
		label: "return",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Declares a return expression."
	}]
};

const KeywordUpdate : IParseMatchRule = {
	label: "update",
	hint: "Updates a statefull variable.",
	match: (token) => token.type === "update",
	autocomplete: () => [{
		label: "update",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Updates a statefull variable."
	}]
};

const KeywordInvoke : IParseMatchRule = {
	label: "invoke",
	hint: "Invokes an action.",
	match: (token) => token.type === "invoke",
	autocomplete: () => [{
		label: "invoke",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Invokes an action."
	}]
};

const KeywordFunction : IParseMatchRule = {
	label: "fn",
	hint: "Defines lambda function.",
	match: (token) => token.type === "fn",
	autocomplete: () => [{
		label: "fn",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Defines lambda function."
	}]
};

const KeywordWhen : IParseMatchRule = {
	label: "when",
	hint: "Expression condition statement.",
	match: (token) => token.type === "when",
	autocomplete: () => [{
		label: "when",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Expression condition statement."
	}]
};

const KeywordIs : IParseMatchRule = {
	label: "is",
	hint: "Compares type.",
	match: (token) => token.type === "is",
	autocomplete: () => [{
		label: "is",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Compares type."
	}]
};

const KeywordThen : IParseMatchRule = {
	label: "then",
	match: (token) => token.type === "then"
};

const KeywordElse : IParseMatchRule = {
	label: "else",
	match: (token) => token.type === "else"
};

/*
 * BRACKETS
 */
const ParanOpen : IParseMatchRule = {
	label: "(",
	match: (token) => token.type === "paranOpen"
};

const ParanClose : IParseMatchRule = {
	label: ")",
	match: (token) => token.type === "paranClose"
};

const BracketOpen : IParseMatchRule = {
	label: "[",
	match: (token) => token.type === "bracketOpen"
};

const BracketClose : IParseMatchRule = {
	label: "]",
	match: (token) => token.type === "bracketClose"
};

const BraceOpen : IParseMatchRule = {
	label: "{",
	match: (token) => token.type === "braceOpen"
};

const BraceClose : IParseMatchRule = {
	label: "}",
	match: (token) => token.type === "braceClose"
};

/*
 * COMPARISION OPERATORS
 */
const Lt : IParseMatchRule = {
	label: "<",
	match: (token) => token.type === "lt"
};

const Lte : IParseMatchRule = {
	label: "<=",
	match: (token) => token.type === "lte"
};

const Gt : IParseMatchRule = {
	label: ">",
	match: (token) => token.type === "gt"
};

const Gte : IParseMatchRule = {
	label: ">=",
	match: (token) => token.type === "gte"
};

const Equal : IParseMatchRule = {
	label: "eq",
	match: (token) => token.type === "eq"
};

const NotEqual : IParseMatchRule = {
	label: "neq",
	match: (token) => token.type === "neq"
};

/*
 * LOGICAL OPERATORS
 */
const And : IParseMatchRule = {
	label: "and",
	hint: "Logical AND operator.",
	match: (token) => token.type === "and",
	autocomplete: () => [{
		label: "and",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Logical AND operator."
	}]
};

const Or : IParseMatchRule = {
	label: "or",
	hint: "Logical OR operator.",
	match: (token) => token.type === "or",
	autocomplete: () => [{
		label: "or",
		kind: CMPL_ITEM_KIND.Keyword,
		detail: "Logical OR operator."
	}]
};

const Not : IParseMatchRule = {
	label: "not",
	match: (token) => token.type === "not"
};

const QuestionMark : IParseMatchRule = {
	label: "questionmark",
	match: (token) => token.type === "questionmark"
};

/*
 * OPERATORS
 */
const Assignment : IParseMatchRule = {
	label: "=",
	match: (token) => token.type === "assignment"
};

const Arrow : IParseMatchRule = {
	label: "=>",
	match: (token) => token.type === "arrow"
};

const Hash : IParseMatchRule = {
	label: "#",
	match: (token) => token.type === "hash"
};

const Pipe : IParseMatchRule = {
	label: "|",
	match: (token) => token.type === "pipe"
};

const Amp : IParseMatchRule = {
	label: "&",
	match: (token) => token.type === "amp"
};

const Multiply : IParseMatchRule = {
	label: "*",
	match: (token) => token.type === "multiply"
};

const Divide : IParseMatchRule = {
	label: "/",
	match: (token) => token.type === "divide"
};

const Plus : IParseMatchRule = {
	label: "+",
	match: (token) => token.type === "plus"
};

const Minus : IParseMatchRule = {
	label: "-",
	match: (token) => token.type === "minus"
};

const Modulo : IParseMatchRule = {
	label: "%",
	match: (token) => token.type === "modulo"
};

/*
 * PUNCTUATIONS
 */
const Semicolon : IParseMatchRule = {
	label: ";",
	match: (token) => token.type === "semicolon"
};

const Colon : IParseMatchRule = {
	label: ":",
	match: (token) => token.type === "colon"
};

const Dot : IParseMatchRule = {
	label: ".",
	match: (token) => token.type === "dot"
};

const Comma : IParseMatchRule = {
	label: ",",
	match: (token) => token.type === "comma"
};

/*
 * WHITESPACE(s)
 */
const WS : IParseMatchRule = {
	label: "Whitespace",
	match: (token) => token.type === "ws"
};

const NL : IParseMatchRule = {
	label: "Newline",
	match: (token) => token.type === "nl"
};

const _ = opt(WS);

/*
 * IDENTIFIERS
 */
const Identifier : IParseMatchRule = {
	label: "Identifier",
	match: (token) => token.type === "identifier" || Object.keys(keywords).indexOf(token.type) >= 0,
	autocomplete: AutocompleteIdentifier()
};

const IdentifierDeclaration : IParseMatchRule = {
	label: "Identifier",
	match: (token) => token.type === "identifier" || Object.keys(keywords).indexOf(token.type) >= 0
};

const ScopedIdentifier = (scope: Array<string>) : IParseMatchRule => ({
	label: "Identifier",
	match: (token) => token.type === "identifier" || Object.keys(keywords).indexOf(token.type) >= 0,
	autocomplete: AutocompleteIdentifier(scope)
});

const NSIdentifier = (ctx: IParseContext) => {

	const res = [];
	const parseInfo = [];

	// Read first identifier
	if (!expect(Identifier)) {
		return false;
	}

	res.push(Parser.getToken().value);
	parseInfo.push(tokenToRange(Parser.getToken()));

	// Try to accept delimited identifiers
	while(accept(Dot)) {

		if (!expect(ScopedIdentifier(res.slice()))) {
			return false;
		}

		res.push(Parser.getToken().value);
		parseInfo.push(tokenToRange(Parser.getToken()));

	}

	return {
		id: res,
		parseInfo: parseInfo
	};

};

const Attribute : IParseMatchRule = {
	label: "@",
	match: (token) => token.type === "attribute"
};

const Dollar : IParseMatchRule = {
	label: "$",
	match: (token) => token.type === "dollar"
};

const Tilda : IParseMatchRule = {
	label: "~",
	match: (token) => token.type === "tilda"
};

/*
 * LITERALS
 */
const LiteralString : IParseMatchRule = {
	label: "String literal",
	match: (token) => token.type === "string_literal"
};

const StringTemplateOpen : IParseMatchRule = {
	label: "`",
	match: (token) => token.type === "string_template"
};

const StringTemplateClose : IParseMatchRule = {
	label: "`",
	match: (token) => token.type === "strend"
};

const StringTemplateConst : IParseMatchRule = {
	label: "String",
	match: (token) => token.type === "const"
};

const StringTemplateEscape : IParseMatchRule = {
	label: "\\",
	match: (token) => token.type === "escape"
};

const StringTemplateInterpolation : IParseMatchRule = {
	label: "String template interpolation",
	match: (token) => token.type === "interpolation"
};

const URIString : IParseMatchRule = {
	label: "String literal",
	match: (token) => token.type === "string_literal"
};

const LiteralNumber : IParseMatchRule = {
	label: "Number literal",
	match: (token) => token.type === "number_literal"
};

const LiteralBooleanTrue : IParseMatchRule = {
	label: "true",
	match: (token) => token.type === "true"
};

const LiteralBooleanFalse : IParseMatchRule = {
	label: "false",
	match: (token) => token.type === "false"
};

const LiteralNull : IParseMatchRule = {
	label: "null",
	match: (token) => token.type === "null"
};

/*
 * COMMENT(s)
 */
const CommentSingeline : IParseMatchRule = {
	label: "Single-line Comment",
	match: (token) => token.type === "comment"
};

const CommentMultilineOpen : IParseMatchRule = {
	label: "Multi-line Comment Open",
	match: (token) => token.type === "commentOpen"
};

const CommentMultilineClose : IParseMatchRule = {
	label: "Multi-line Comment Close",
	match: (token) => token.type === "commentClose"
};

const CommentMultilineBody = anyUntil(CommentMultilineClose);

const CommentOneOf = [
	{ match: CommentMultilineOpen, do: CommentMultilineBody, excludeHint: true },
	{ match: CommentSingeline, excludeHint: true }
];

/** Whitespace or comment */
const __ = repeat(oneOf([
	...CommentOneOf,
	{ match: WS },
	{ match: NL }
]), null);

/*
 * TYPE EXPRESSION
 */
export const ParseTypeParenthesis = block(ParanOpen, [ (ctx) => ParseTypeExpression(ctx) ], ParanClose, (res) => res[0]);

export const ParseTypeReference = seq([ NSIdentifier, _ , (ctx) => ParseTypeParameters(ctx) ], null, (res, st, et) => ({
	n: AST_NODE_TYPES.REF_TYPE,
	p: res[2] || [],
	ns: res[0].id.slice(0, res[0].id.length - 1),
	r: res[0].id[res[0].id.length - 1],
	parseInfo: {
		range: tokenToRange(st, et),
		ns: res[0].parseInfo.slice(0, res[0].parseInfo.length - 1),
		r: res[0].parseInfo[res[0].parseInfo.length - 1]
	}
} as IASTSchemaRefType));

export const ParseTypeStructElement = seq(
	[ e(IdentifierDeclaration), _ , e(Colon) , __ , (ctx) => ParseTypeExpression(ctx) , __ , e(Semicolon) , __ ], null,
	(res, _st, _et) => ({
		identifier: res[0].value,
		identifierToken: res[0],
		type: res[4]
	})
);

export const ParseTypeStruct = block(
	BraceOpen, [ __ , repeatSince(IdentifierDeclaration, ParseTypeStructElement, null, true) ], BraceClose,
	(res, st, et) : IASTSchemaTypeStruct => {

		const props = {};
		const propParseIds = {};

		if (res[1]) {
			for (let i = 0; i < res[1].length; i++) {

				const key = res[1][i].identifier;

				if (props[key] !== undefined) {
					Parser.addError(
						DOC_ERROR_SEVERITY.ERROR,
						"Duplicate identifier",
						`Property '${key}' is already defined.`,
						tokenToRange(res[1][i].identifierToken)
					);
				}

				props[key] = res[1][i].type;
				propParseIds[key] = tokenToRange(res[1][i].identifierToken);

			}
		}

		return {
			n: AST_NODE_TYPES.TYPE_STRUCT,
			p: props,
			parseInfo: {
				range: tokenToRange(st, et),
				p: propParseIds
			}
		} as IASTSchemaTypeStruct;

	}
);

export const ParseTypeParameters = block(
	Lt, [ list((ctx) => ParseTypeExpression(ctx), Comma) ], Gt,
	(res, _st, _et) : IASTSchemaTypeParameterList => res[0]
);

export const ParseTypeExpressionElement = expectOneOf([
	{ match: Identifier, do: ParseTypeReference }, // Type identifier
	{ match: ParanOpen, do: ParseTypeParenthesis }, // Parenthesis
	{ match: BraceOpen, do: ParseTypeStruct } // Struct
], null, true);

export const ParseTypeExpression = seq(
	[ __ , ParseTypeExpressionElement , __ , oneOf([
		{ match: Pipe, do: (ctx) => ({
			type: "pipe",
			right: ParseTypeExpression(ctx)
		}) },
		{ match: Amp, do: (ctx) => ({
			type: "amp",
			right: ParseTypeExpression(ctx)
		}) }
	]) , __ ], null,
	(res, st, et) => {

		if (res[3] && res[3].type === "pipe") {

			return {
				n: AST_NODE_TYPES.TYPE_ONEOF,
				t: [ res[1] ].concat( res[3].right instanceof Array ? res[3].right : [ res[3].right ] ),
				parseInfo: {
					range: tokenToRange(st, et)
				}
			} as IASTSchemaTypeOneOf;

		} else if (res[3] && res[3].type === "amp") {

			return {
				n: AST_NODE_TYPES.TYPE_ALLOF,
				t: [ res[1] ].concat( res[3].right instanceof Array ? res[3].right : [ res[3].right ] ),
				parseInfo: {
					range: tokenToRange(st, et)
				}
			} as IASTSchemaTypeAllOf;

		} else {

			return res[1];

		}

	}
);

/*
 * EXPRESSION
 */
export const ParseLambdaFunction = seq(
	[ e(KeywordFunction) , _ , (ctx) => ParseSchemaParamDeclaration(ctx) , __ , e(Arrow) , __ , (ctx) => ParseExpression(ctx) ],
	null,
	(res, st, et) => ({
		n: AST_NODE_TYPES.LAMBDA,
		p: res[2],
		b: res[6],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaLambda)
);

export const ParseWhenStatementCondition = seq(
	// tslint:disable-next-line: max-line-length
	[ __ , (ctx) => ParseExpression(ctx) , __ , e(ParanClose) , __ , e(Arrow) , __ , (ctx) => ParseExpression(ctx) , __ , e(Semicolon) , __ ], null,
	(res, _st, _et) => ({
		w: res[1],
		t: res[7]
	} as IASTSchemaConditionElement)
);

export const ParseWhenStatement = seq(
	[ e(KeywordWhen) , __ , e(BraceOpen) , __ , repeatSince(ParanOpen, ParseWhenStatementCondition, null, false) ],
	BraceClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.CONDITION,
		c: res[4],
		d: null,
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaCondition)
);

export const ParsePropertyDotAccessor = seq(
	[ e(Identifier) , (ctx) => ParseProperty(ctx) ],
	null,
	(res, st, et) => {

		return (value : TASTSchemaExpression) => {

			const propRef : IASTSchemaRefProperty = {
				n: AST_NODE_TYPES.REF_PROPERTY,
				v: value,
				i: {
					n: AST_NODE_TYPES.CONST,
					t: {
						n: AST_NODE_TYPES.REF_TYPE,
						ns: builtinTypes.String.ns,
						r: builtinTypes.String.id,
						p: [],
						parseInfo: {
							range: tokenToRange(res[0])
						}
					},
					v: res[0].value
				} as IASTSchemaConst,
				parseInfo: {
					range: tokenToRange(st, et)
				}
			};

			return res[1] ? res[1](propRef) : propRef;

		};

	}
);

export const ParsePropertyIndexAccessor = seq(
	[ __ , (ctx) => ParseExpression(ctx), __ , e(BracketClose) , (ctx) => ParseProperty(ctx) ],
	null,
	(res, st, et) => {

		return (value : TASTSchemaExpression) => {

			const propRef : IASTSchemaRefProperty = {
				n: AST_NODE_TYPES.REF_PROPERTY,
				v: value,
				i: res[1],
				parseInfo: {
					range: tokenToRange(st, et)
				}
			};

			return res[4] ? res[4](propRef) : propRef;

		};

	}
);

export const ParseActionRef = seq(
	[ e(Identifier) ],
	null,
	(res, st, et) => (value : TASTSchemaExpression) => ({
		n: AST_NODE_TYPES.REF_ACTION,
		id: res[0].value,
		r: value,
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaRefAction)
);

export const ParseProperty = oneOf([
	{ match: Dot, do: ParsePropertyDotAccessor },
	{ match: BracketOpen, do: ParsePropertyIndexAccessor },
	{ match: Hash, do: ParseActionRef }
]);

export const ParseAttribute = seq(
	[ e(Attribute) , e(Identifier) , ParseProperty ],
	null,
	(res, st, et) => {

		const attrRef : IASTSchemaRefParam = {
			n: AST_NODE_TYPES.REF_PARAM,
			r: res[1].value,
			parseInfo: {
				range: tokenToRange(st, et)
			}
		};

		return res[2] ? res[2](attrRef) : attrRef;

	}
);

export const ParseRefVariable = seq(
	[ e(Identifier) , ParseProperty ],
	null,
	(res, st, et) => {

		const varRef : IASTSchemaRefVariable = {
			n: AST_NODE_TYPES.REF_VARIABLE,
			r: res[0].value,
			parseInfo: {
				range: tokenToRange(st, et)
			}
		};

		return res[1] ? res[1](varRef) : varRef;

	}
);

export const ParseCallArgumentsElement = seq(
	[
		__ , opt(Tilda) , (ctx) => ParseExpression(ctx), _ ,
		startsWith(Colon, [ __ , (ctx) => ParseExpression(ctx) ], (res) => res[1], false), __
	], null,
	(res, st, et) => {

		// Named argument?
		if (res[4]) {

			// Check unpack
			if (res[1]) {
				Parser.addError(
					DOC_ERROR_SEVERITY.ERROR,
					"Invalid syntax",
					`Unpack operator is allowed only for rest arguments.`,
					tokenToRange(res[1])
				);

				return false;
			}

			// Check identifier
			if (!res[2] || res[2].n !== AST_NODE_TYPES.REF_VARIABLE) {
				Parser.addError(
					DOC_ERROR_SEVERITY.ERROR,
					"Invalid syntax",
					`Expecting identifier.`,
					res[2] ? res[2].parseInfo.range : null
				);

				return false;
			}

			return {
				n: AST_NODE_TYPES.CALL_ARGUMENT,
				id: res[2].id,
				v: res[4],
				r: false,
				parseInfo: {
					range: tokenToRange(st, et)
				}
			} as IASTSchemaCallArgument

		// Rest argument
		} else {

			return {
				n: AST_NODE_TYPES.CALL_ARGUMENT,
				id: null,
				v: res[2],
				r: res[1] ? true : false,
				parseInfo: {
					range: tokenToRange(st, et)
				}
			} as IASTSchemaCallArgument

		}

	}
);

export const ParseCallArguments = block(
	ParanOpen, [ __ , oneOf([
		{ match: ParanClose, do: (_ctx) => null },
		{ match: AnyToken, do: list(ParseCallArgumentsElement, Comma) }
	], null, true) ], ParanClose,
	(res, _st, _et) : IASTSchemaParamList => res[1] ? res[1].filter((x) => x !== null) : []
);

export const ParseRefOrCall = seq(
	[
		// Parse a reference to an attribute or a variable, or a namespace
		expectOneOf([
			{ match: Attribute, do: ParseAttribute },
			{ match: Identifier, do: ParseRefVariable }
		], null, true) ,
		// Accept WS
		_ ,
		// Accept type parameters?
		tryParse((ctx) => ParseTypeParameters(ctx)) ,
		_ ,
		// Accept parenthesis indicating a call?
		startsWith(ParanOpen, [ ParseCallArguments ], (res) => res[0], true)
	],
	null,
	(res, st, et) => {

		if (res[4]) {
			return {
				n: AST_NODE_TYPES.CALL,
				s: res[0],
				p: res[2],
				a: res[4],
				parseInfo: {
					range: tokenToRange(st, et)
				}
			} as IASTSchemaCall;
		} else {

			// Allow type params only for calls
			if (res[2]) {
				Parser.addError(
					DOC_ERROR_SEVERITY.ERROR,
					"Invalid syntax",
					`Type parameters are allowed only for calls.`,
					tokenToRange(st, et)
				);

				return false;
			}

			return res[0];
		}

	}
);

export const ParseConstString = e(LiteralString, (t) => ({
	n: AST_NODE_TYPES.CONST,
	t: {
		n: AST_NODE_TYPES.REF_TYPE,
		ns: builtinTypes.String.ns,
		r: builtinTypes.String.id,
		p: [],
		parseInfo: {
			range: tokenToRange(t)
		}
	},
	v: t.value,
	parseInfo: {
		range: tokenToRange(t)
	}
} as IASTSchemaConst));

export const ParseConstNumber = e(LiteralNumber, (t) => ({
	n: AST_NODE_TYPES.CONST,
	t: {
		n: AST_NODE_TYPES.REF_TYPE,
		ns: builtinTypes.Number.ns,
		r: builtinTypes.Number.id,
		p: [],
		parseInfo: {
			range: tokenToRange(t)
		}
	},
	v: parseFloat(t.value),
	parseInfo: {
		range: tokenToRange(t)
	}
} as IASTSchemaConst));

export const ParseConstBooleanTrue = e(LiteralBooleanTrue, (t) => ({
	n: AST_NODE_TYPES.CONST,
	t: {
		n: AST_NODE_TYPES.REF_TYPE,
		ns: builtinTypes.Boolean.ns,
		r: builtinTypes.Boolean.id,
		p: [],
		parseInfo: {
			range: tokenToRange(t)
		}
	},
	v: true,
	parseInfo: {
		range: tokenToRange(t)
	}
} as IASTSchemaConst));

export const ParseConstBooleanFalse = e(LiteralBooleanFalse, (t) => ({
	n: AST_NODE_TYPES.CONST,
	t: {
		n: AST_NODE_TYPES.REF_TYPE,
		ns: builtinTypes.Boolean.ns,
		r: builtinTypes.Boolean.id,
		p: [],
		parseInfo: {
			range: tokenToRange(t)
		}
	},
	v: false,
	parseInfo: {
		range: tokenToRange(t)
	}
} as IASTSchemaConst));

export const ParseConstNull = e(LiteralNull, (t) => ({
	n: AST_NODE_TYPES.CONST,
	t: {
		n: AST_NODE_TYPES.REF_TYPE,
		ns: builtinTypes.Null.ns,
		r: builtinTypes.Null.id,
		p: [],
		parseInfo: {
			range: tokenToRange(t)
		}
	},
	v: null,
	parseInfo: {
		range: tokenToRange(t)
	}
} as IASTSchemaConst));

export const ParseStringTemplateInterpolation = block(
	StringTemplateInterpolation, [ (ctx) => ParseExpression(ctx) ], BraceClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.CALL_ARGUMENT,
		id: "value",
		r: false,
		v: res[0],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaCallArgument)
);

export const ParseStringTemplate = expectBlock(
	StringTemplateOpen, [ repeat(oneOf([
		{ match: StringTemplateConst, do: e(StringTemplateConst, (t) => ({
			n: AST_NODE_TYPES.CALL_ARGUMENT,
			id: "value",
			r: false,
			v: {
				n: AST_NODE_TYPES.CONST,
				t: {
					n: AST_NODE_TYPES.REF_TYPE,
					ns: builtinTypes.String.ns,
					r: builtinTypes.String.id,
					p: [],
					parseInfo: {
						range: tokenToRange(t)
					}
				},
				v: t.value,
				parseInfo: { range: tokenToRange(t) }
			} as IASTSchemaConst,
			parseInfo: { range: tokenToRange(t) }
		} as IASTSchemaCallArgument)) },
		{ match: StringTemplateEscape, do: e(StringTemplateEscape, (t) => ({
			n: AST_NODE_TYPES.CALL_ARGUMENT,
			id: "value",
			r: false,
			v: {
				n: AST_NODE_TYPES.CONST,
				t: {
					n: AST_NODE_TYPES.REF_TYPE,
					ns: builtinTypes.String.ns,
					r: builtinTypes.String.id,
					p: [],
					parseInfo: {
						range: tokenToRange(t)
					}
				},
				v: t.value.substr(1),
				parseInfo: { range: tokenToRange(t) }
			} as IASTSchemaConst,
			parseInfo: { range: tokenToRange(t) }
		} as IASTSchemaCallArgument)) },
		{ match: StringTemplateInterpolation, do: ParseStringTemplateInterpolation }
	], null, true)) ], StringTemplateClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.CALL,
		s: {
			n: AST_NODE_TYPES.REF_SCHEMA,
			ns: builtinSchemas.concat.ns,
			r: builtinSchemas.concat.id
		} as IASTSchemaRefSchema,
		a: res[0],
		parseInfo: {
			range: {
				start: tokenToPosition(st),
				end: tokenToPosition(et)
			}
		}
	} as IASTSchemaCall)
);

export const ParseSubExpression = seq(
	[ e(ParanOpen), __ , (ctx) => ParseExpression(ctx) , __ ],
	ParanClose,
	(res) => res[2]
);

export const ParseExpressionListElement = seq(
	[ __ , oneOf([
		{ match: BracketClose, do: (_ctx) => null },
		{ match: AnyToken, do: (ctx) => ParseExpression(ctx) }
	], null, true) , __ ],
	null,
	(res) => res[1]
);

export const ParseExpressionList = block(
	BracketOpen , [ list(ParseExpressionListElement, Comma) ], BracketClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.VALUE_LIST,
		e: res[0].filter((x) => x !== null),
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaValueList)
);

export const ParseExpressionStructElement = seq(
	[ __ , e(Identifier), _ , e(Colon) , __ , (ctx) => ParseExpression(ctx) , __ ], null,
	(res, _st, _et) => ({
		identifier: res[1].value,
		identifierToken: res[1],
		value: res[5]
	})
);

export const ParseExpressionStruct = block(
	BraceOpen, [ __ , startsWith(Identifier, [ list(ParseExpressionStructElement, Comma) ], (res) => res[0], true) ], BraceClose,
	(res, st, et) => {

		const props = {};

		if (res[1]) {
			for (let i = 0; i < res[1].length; i++) {
				const key = res[1][i].identifier;

				if (props[key] !== undefined) {
					Parser.addError(
						DOC_ERROR_SEVERITY.ERROR,
						"Duplicate identifier",
						`Property '${key}' is already defined.`,
						tokenToRange(res[1][i].identifierToken)
					);
				}

				props[key] = res[1][i].value;

			}
		}

		return {
			n: AST_NODE_TYPES.VALUE_STRUCT,
			p: props,
			parseInfo: {
				range: tokenToRange(st, et)
			}
		} as IASTSchemaValueStruct;

	}
);

export const ParseRefTranslation = block(
	Dollar , [ NSIdentifier , _ , ParseCallArguments ] , Dollar,
	(res, st, et) => ({
		n: AST_NODE_TYPES.REF_TRANSLATION,
		ns: res[0].id.slice(0, res[0].id.length - 1),
		r: res[0].id[res[0].id.length - 1],
		a: res[2],
		parseInfo: {
			range: tokenToRange(st, et),
			ns: res[0].parseInfo.slice(0, res[0].parseInfo.length - 1),
			r: res[0].parseInfo[res[0].parseInfo.length - 1],
		}
	} as ISchemaRefTranslation)
);

export const ParseOperatorAsCall = (schemaRef: { ns: Array<string>, id: string }) => seq(
	[ __ , (ctx) => ParseExpression(ctx) ],
	null,
	(res, _st, et) => ((leftOperand: TASTSchemaExpression) => ({
			n: AST_NODE_TYPES.CALL,
			s: {
				n: AST_NODE_TYPES.REF_SCHEMA,
				ns: schemaRef.ns,
				r: schemaRef.id
			} as IASTSchemaRefSchema,
			a: [{
				n: AST_NODE_TYPES.CALL_ARGUMENT,
				id: "left",
				v: leftOperand,
				r: false
			}, {
				n: AST_NODE_TYPES.CALL_ARGUMENT,
				id: "right",
				v: res[1],
				r: false
			}],
			parseInfo: {
				range: {
					start: leftOperand.parseInfo.range.start,
					end: tokenToPosition(et)
				}
			}
		} as IASTSchemaCall))
);

export const ParseInlineKeywordCondition = seq(
	[ __ , (ctx) => ParseExpression(ctx) , __ , startsWith(KeywordElse, [ __ , (ctx) => ParseExpression(ctx) ], (res) => res[1], false) ],
	null,
	(res, _st, et) => (leftOperand: TASTSchemaExpression) => ({
		n: AST_NODE_TYPES.CONDITION,
		c: [{
			w: leftOperand,
			t: res[1]
		}],
		d: res[3],
		parseInfo: {
			range: {
				start: leftOperand.parseInfo.range.start,
				end: tokenToPosition(et)
			}
		}
	} as IASTSchemaCondition)
);

export const ParseInlineTenaryCondition = seq(
	[ __ , (ctx) => ParseExpression(ctx) , __ , startsWith(Colon, [ __ , (ctx) => ParseExpression(ctx) ], (res) => res[1], false) ],
	null,
	(res, _st, et) => (leftOperand: TASTSchemaExpression) => ({
		n: AST_NODE_TYPES.CONDITION,
		c: [{
			w: leftOperand,
			t: res[1]
		}],
		d: res[3],
		parseInfo: {
			range: {
				start: leftOperand.parseInfo.range.start,
				end: tokenToPosition(et)
			}
		}
	} as IASTSchemaCondition)
);

export const ParseNotOperator = seq(
	[ e(Not), __ , (ctx) => ParseExpressionOperand(ctx) ],
	null,
	(res, st, et) => ({
		n: AST_NODE_TYPES.CALL,
		s: {
			n: AST_NODE_TYPES.REF_SCHEMA,
			ns: builtinSchemas.not.ns,
			r: builtinSchemas.not.id
		} as IASTSchemaRefSchema,
		a: [{
			n: AST_NODE_TYPES.CALL_ARGUMENT,
			id: "value",
			r: false,
			v: res[2],
			parseInfo: {
				range: tokenToRange(st, et)
			}
		}],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaCall)
);

export const ParseExpressionOperand = expectOneOf([
	{ match: Not, do: ParseNotOperator }, // Parse not operator
	{ match: KeywordFunction, do: ParseLambdaFunction }, // Parse lambda definition
	{ match: KeywordWhen, do: ParseWhenStatement }, // Parse when statement
	{ match: LiteralBooleanTrue, do: ParseConstBooleanTrue }, // Parse boolean literal
	{ match: LiteralBooleanFalse, do: ParseConstBooleanFalse }, // Parse boolean literal
	{ match: LiteralNull, do: ParseConstNull }, // Parse null literal
	{ match: Attribute, do: ParseRefOrCall }, // Parse attribute identifier
	{ match: Identifier, do: ParseRefOrCall }, // Parse identifier or call
	{ match: StringTemplateOpen, do: ParseStringTemplate }, // Parse string literal
	{ match: LiteralString, do: ParseConstString }, // Parse string literal
	{ match: LiteralNumber, do: ParseConstNumber }, // Parse number literal
	{ match: ParanOpen, do: ParseSubExpression }, // Sub-expression
	{ match: BracketOpen, do: ParseExpressionList }, // Parse inline array
	{ match: BraceOpen, do: ParseExpressionStruct }, // Parse inline object
	{ match: Dollar, do: ParseRefTranslation } // Parse translation term
], null, true);

export const ParseExpression = seq(
	[
		// Expect operand
		ParseExpressionOperand,
		__ ,

		// Accept "is" operator
		startsWith(KeywordIs, [
			__ , opt(Not) , __ , expectBlock(Lt , [ ParseTypeExpression ] , Gt, (res) => res[0] ) , __
		], (res, _st, _et) => (leftValue: TASTSchemaExpression) => {

			const typeCond: IASTSchemaConditionType = {
				n: AST_NODE_TYPES.CONDITION_TYPE,
				v: leftValue,
				t: res[3],
				parseInfo: {
					range: {
						start: leftValue.parseInfo.range.start,
						end: res[3].parseInfo.range.end
					}
				}
			};

			if (res[2]) {
				return {
					n: AST_NODE_TYPES.CALL,
					s: {
						n: AST_NODE_TYPES.REF_SCHEMA,
						ns: builtinSchemas.not.ns,
						r: builtinSchemas.not.id
					} as IASTSchemaRefSchema,
					a: [{
						n: AST_NODE_TYPES.CALL_ARGUMENT,
						id: "value",
						r: false,
						v: typeCond,
						parseInfo: {
							range: {
								start: leftValue.parseInfo.range.start,
								end: res[3].parseInfo.range.end
							}
						}
					}],
					parseInfo: {
						range: {
							start: leftValue.parseInfo.range.start,
							end: res[3].parseInfo.range.end
						}
					}
				} as IASTSchemaCall;
			} else {
				return typeCond;
			}

		} , false),

		// Accept operator
		oneOf([
			{ match: Lt, do: ParseOperatorAsCall(builtinSchemas.lt) }, // Parse lt operator
			{ match: Lte, do: ParseOperatorAsCall(builtinSchemas.lte) }, // Parse lte operator
			{ match: Gt, do: ParseOperatorAsCall(builtinSchemas.gt) }, // Parse gt operator
			{ match: Gte, do: ParseOperatorAsCall(builtinSchemas.gte) }, // Parse gte operator
			{ match: Equal, do: ParseOperatorAsCall(builtinSchemas.equal) }, // Parse eq operator
			{ match: NotEqual, do: ParseOperatorAsCall(builtinSchemas.notEqual) }, // Parse neq operator
			{ match: And, do: ParseOperatorAsCall(builtinSchemas.and) }, // Parse and operator
			{ match: Or, do: ParseOperatorAsCall(builtinSchemas.or) }, // Parse or operator
			{ match: Pipe, do: ParseOperatorAsCall(builtinSchemas.or) }, // Parse bit or operator
			{ match: Amp, do: ParseOperatorAsCall(builtinSchemas.and) }, // Parse bit and operator,
			{ match: Multiply, do: ParseOperatorAsCall(builtinSchemas.multiply) }, // Parse multiply operator
			{ match: Divide, do: ParseOperatorAsCall(builtinSchemas.divide) }, // Parse division operator
			{ match: Modulo, do: ParseOperatorAsCall(builtinSchemas.modulo) }, // Parse modulo operator
			{ match: Plus, do: ParseOperatorAsCall(builtinSchemas.sum) }, // Parse plus operator
			{ match: Minus, do: ParseOperatorAsCall(builtinSchemas.sub) }, // Parse minus operator
			{ match: KeywordThen, do: ParseInlineKeywordCondition }, // Parse keyword if operator
			{ match: QuestionMark, do: ParseInlineTenaryCondition } // Parse tenary if operator
		])
	],
	null,
	(res) => {

		const leftOp = res[2] ? res[2](res[0]) : res[0];

		if (res[3]) {
			return res[3](leftOp);
		} else {
			return leftOp;
		}

	}
);

/*
 * TYPE DECLARATION
 */
export const ParseTypeGenericsDeclarationElement = seq(
	[ __ , e(IdentifierDeclaration) , _ , block(KeywordExtends, [ _ , ParseTypeExpression ], null) , __ ], null,
	(res, st, et) => ({
		n: AST_NODE_TYPES.GENERIC,
		id: res[1].value,
		ex: res[3] ? res[3][1] : null,
		df: null,
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaGeneric)
);

export const ParseTypeGenericsDeclaration = block(
	Lt, [ list(ParseTypeGenericsDeclarationElement, Comma) ], Gt,
	(res, _st, _et) : IASTSchemaGenericList => res[0]
);

export const ParseTypeDeclaration = seq(
	[ _ , e(IdentifierDeclaration) , _ , ParseTypeGenericsDeclaration , __ , e(Assignment) , __ , ParseTypeExpression ], Semicolon,
	(res, st, et) => ({
		n: AST_NODE_TYPES.TYPE,
		id: res[1].value,
		g: res[3],
		t: res[7],
		parseInfo: {
			range: tokenToRange(st, et),
			id: tokenToRange(res[1])
		}
	} as IASTSchemaType)
);

/*
 * SCHEMA DECLARATION
 */
export const ParseSchemaParamDeclarationElement = seq(
	[ __ , opt(Multiply) , e(IdentifierDeclaration), _ , e(Colon) , __ , (ctx) => ParseTypeExpression(ctx) , __ , startsWith(
		Assignment, [ _ , ParseExpression , __ ], (res) => res[1], false
	) ], null,
	(res, _st, _et) => ({
		n: AST_NODE_TYPES.SCHEMA_PARAM,
		id: res[2].value,
		t: res[6],
		v: res[8],
		r: res[1] ? true : false
	} as IASTSchemaParam)
);

export const ParseSchemaParamDeclaration = block(
	ParanOpen, [ __ , startsWith(IdentifierDeclaration, [ list(ParseSchemaParamDeclarationElement, Comma) ]) ], ParanClose,
	(res, _st, _et) : IASTSchemaParamList => res[1] ? res[1][0] : []
);

export const ParseLetStatement = seq(
	[
		// Is inherited or propagated
		_ , oneOf([
			{ match: KeywordPropagate, do: (_ctx) => "propagate" },
			{ match: KeywordInherit, do: (_ctx) => "inherit" }
		]) ,
		// Is statefull
		_ , opt(KeywordState) ,
		// Identifier
		_ , e(IdentifierDeclaration) , _ ,
		// Type
		startsWith(Colon, [ _ , ParseTypeExpression ], (res) => res[1], false),
		// Assignment
		_ , e(Assignment) , __ , ParseExpression , __
	], Semicolon,
	(res, st, et) => ({
		n: AST_NODE_TYPES.VARIABLE,
		id: res[5].value,
		cm: null,
		t: res[7],
		v: res[11],
		st: res[3] ? true : false,
		pr: res[1] && res[1] === "propagate" ? true : false,
		in: res[1] && res[1] === "inherit" ? true : false,
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaVariable)
);

export const ParseReturnStatement = seq(
	[ _ , ParseExpression ], Semicolon,
	(res, st, et) => ({
		n: AST_NODE_TYPES.RETURN,
		v: res[1],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaReturn)
);

export const ParseActionUpdateStatement = seq(
	[ _ , e(Identifier) , _ , e(Assignment) , __ , ParseExpression ], Semicolon,
	(res, st, et) => ({
		n: AST_NODE_TYPES.UPDATE,
		r: {
			n: AST_NODE_TYPES.REF_VARIABLE,
			r: res[1].value,
			parseInfo: {
				range: tokenToRange(res[1])
			}
		},
		v: res[5],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaUpdate)
);

export const ParseActionInvokeStatement = seq(
	[ _ , expectOneOf([
		{ match: Attribute, do: ParseAttribute },
		{ match: Identifier, do: ParseRefVariable }
	], null, true) , __ , ParseCallArguments ], Semicolon,
	(res, st, et) => {

		// Check if a resolved identifier points to an action
		if (res[1].n !== AST_NODE_TYPES.REF_ACTION) {
			Parser.addError(
				DOC_ERROR_SEVERITY.ERROR,
				"Invalid syntax",
				`Expected reference to an action (using # notation).`,
				tokenToRange(res[1].parseInfo.range)
			);
		}

		return {
			n: AST_NODE_TYPES.INVOKE,
			s: res[1],
			a: res[5],
			parseInfo: {
				range: tokenToRange(st, et)
			}
		} as IASTSchemaInvoke;

	}
);

export const ParseActionBodyStatement = oneOf([
	...CommentOneOf,
	{ match: KeywordLet, do: ParseLetStatement },
	{ match: KeywordUpdate, do: ParseActionUpdateStatement },
	{ match: KeywordInvoke, do: ParseActionInvokeStatement },
	{ match: WS, excludeHint: true },
	{ match: NL, excludeHint: true }
]);

export const ParseActionBody = repeat(ParseActionBodyStatement);

export const ParseActionStatement = seq(
	[
		// Identifier
		_ , e(IdentifierDeclaration) ,
		// Params
		__ , startsWith(ParanOpen, [ ParseSchemaParamDeclaration ], (res) => res[0], true) , __ ,
		// Body
		e(BraceOpen) , ParseActionBody
	], BraceClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.SCHEMA_ACTION,
		cm: null,
		id: res[1].value,
		o: false,
		p: res[3],
		b: res[6],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaAction)
);

export const ParseOverrideActionStatement = seq(
	[ _ , e(KeywordAction) , _ , ParseActionStatement ], null,
	(res) => ({ ...res[3], o: true } as IASTSchemaAction)
);

export const ParseSchemaStatement = oneOf([
	...CommentOneOf,
	{ match: KeywordLet, do: ParseLetStatement },
	{ match: KeywordAction, do: ParseActionStatement },
	{ match: KeywordOverride, do: ParseOverrideActionStatement },
	{ match: KeywordReturn, do: ParseReturnStatement },
	{ match: WS, excludeHint: true },
	{ match: NL, excludeHint: true }
]);

export const ParseSchemaBody = repeat(ParseSchemaStatement);

export const ParseSchemaDeclaration = seq(
	[
		// Identifier + generics
		_ , e(Identifier) , _ , ParseTypeGenericsDeclaration ,
		// Params
		__ , startsWith(ParanOpen, [ ParseSchemaParamDeclaration ], (res) => res[0], true) , __ ,
		// Body
		e(BraceOpen) , ParseSchemaBody
	], BraceClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.SCHEMA,
		id: res[1].value,
		cm: null,
		g: res[3],
		p: res[5],
		b: res[8],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchema)
);

/*
 * TRANSLATIONS DECLARATION
 */
export const ParseTranslationDeclarationElement = seq(
	[
		// Identifier
		NSIdentifier, _ ,
		// Arguments
		startsWith(ParanOpen, [ ParseSchemaParamDeclaration ], (res) => res[0]), _ ,
		// Definition
		e(Arrow) , __ , (ctx) => ParseExpression(ctx) , __ , e(Semicolon) , __
	], null,
	(res, st, et) => ({
		n: AST_NODE_TYPES.TRANSLATION_TERM,
		id: res[0].id,
		p: res[2] ? res[2] : [],
		v: res[6],
		parseInfo: {
			range: tokenToRange(st, et),
			id: res[0].parseInfo
		},
	} as IASTSchemaTranslationTerm)
);

export const ParseTranslationDeclaration = seq(
	// tslint:disable-next-line: max-line-length
	[ _ , e(Identifier) , __ , e(BraceOpen) , __  , repeatSince(IdentifierDeclaration, ParseTranslationDeclarationElement, null, true) ], BraceClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.TRANSLATION,
		id: res[1].value,
		t: res[5],
		parseInfo: {
			range: tokenToRange(st, et)
		}
	} as IASTSchemaTranslation)
);

/*
 * NAMESPACE STATEMENTS
 */
export const ParseImportStatement = seq([ _ , e(URIString) , _ ], Semicolon, (res, st, et) => ({
	n: AST_NODE_TYPES.IMPORT,
	u: res[1].value,
	parseInfo: {
		range: tokenToRange(st, et)
	}
} as IASTSchemaImport));

export const ParseUseStatement = seq([ _ , NSIdentifier , _ ], Semicolon, (res, st, et) => ({
	n: AST_NODE_TYPES.USE,
	ns: res[1].id,
	parseInfo: {
		range: tokenToRange(st, et),
		ns: res[1].parseInfo
	}
} as IASTSchemaUse));

export const ParseNamespaceDeclaration = seq(
	[ _ , NSIdentifier , _ , e(BraceOpen) , ParseNamespaceBody ], BraceClose,
	(res, st, et) => ({
		n: AST_NODE_TYPES.NAMESPACE,
		id: res[1].id,
		cm: null,
		ns: res[4].ns,
		us: res[4].us,
		s: res[4].s,
		t: res[4].t,
		l: res[4].l,
		parseInfo: {
			range: tokenToRange(st, et),
			id: res[1].parseInfo
		}
	} as IASTSchemaNamespace)
);

export const NamespaceStatementOneOf = [
	...CommentOneOf,
	{ match: KeywordUse, do: ParseUseStatement },
	{ match: KeywordNamespace, do: ParseNamespaceDeclaration },
	{ match: KeywordType, do: ParseTypeDeclaration },
	{ match: KeywordSchema, do: ParseSchemaDeclaration },
	{ match: KeywordTranslation, do: ParseTranslationDeclaration },
	{ match: WS, excludeHint: true },
	{ match: NL, excludeHint: true }
];

export const ParseNamespaceStatement = oneOf(NamespaceStatementOneOf);

export function ParseNamespaceBody(ctx: IParseContext) {

	return repeat(ParseNamespaceStatement, (res) => {

		const out = {
			ns: [],
			us: [],
			s: [],
			t: [],
			l: []
		};

		for (let i = 0; i < res.length; i++) {

			if (!res[i] || !res[i].n) {
				continue;
			}

			switch(res[i].n) {
				case AST_NODE_TYPES.USE:
					out.us.push(res[i]);
					break;

				case AST_NODE_TYPES.TYPE:
					out.t.push(res[i]);
					break;

				case AST_NODE_TYPES.SCHEMA:
					out.s.push(res[i]);
					break;

				case AST_NODE_TYPES.NAMESPACE:
					out.ns.push(res[i]);
					break;

				case AST_NODE_TYPES.TRANSLATION:
					out.l.push(res[i]);
					break;
			}

		}

		return out;

	})(ctx);

}

/*
 * DOCUMENT
 */
export const ParseDocumentStatement = expectOneOf([
	...NamespaceStatementOneOf,
	{ match: KeywordImport, do: ParseImportStatement }
]);

export const ParseDocument = (ctx: IParseContext) => {

	const defaultNs : IASTSchemaNamespace = {
		n: AST_NODE_TYPES.NAMESPACE,
		id: [ "__default__" ],
		cm: null,
		ns: [],
		us: [],
		s: [],
		t: [],
		l: []
	};

	const res : IASTSchemaDocument = {
		n: AST_NODE_TYPES.DOCUMENT,
		im: [],
		ns: [
			defaultNs
		]
	};

	// tslint:disable-next-line: no-conditional-assignment
	while(Parser.hasNextToken()) {

		const stm = ParseDocumentStatement(ctx)

		switch(stm.n) {
			case AST_NODE_TYPES.IMPORT:
				res.im.push(stm);
				break;

			case AST_NODE_TYPES.USE:
				defaultNs.us.push(stm);
				break;

			case AST_NODE_TYPES.TYPE:
				defaultNs.t.push(stm);
				break;

			case AST_NODE_TYPES.SCHEMA:
				defaultNs.s.push(stm);
				break;

			case AST_NODE_TYPES.TRANSLATION:
				defaultNs.l.push(stm);
				break;

			case AST_NODE_TYPES.NAMESPACE:
				res.ns.push(stm);
				break;
		}

	}

	return res;

};