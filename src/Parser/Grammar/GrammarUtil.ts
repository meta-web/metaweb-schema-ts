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

import { Token } from "moo";

import { IParseContext } from "../IParseContext";
import { IParseMatchRule } from "../IParseMatchRule";
import { Parser } from "../Parser";
import { DOC_ERROR_SEVERITY } from "../../Shared/IDocumentError";

/**
 * Parse function
 */
export interface IParseFunction<T = any> {
	(ctx: IParseContext) : T|false;
}

/**
 * Conditionaly accepts token
 *
 * @param rule Match rule
 * @param addCompletition If to add completition items
 * @param preserveToken If to preserve token (eg. don't move to next one)
 */
export function accept(rule: IParseMatchRule, addCompletition: boolean = true, preserveToken: boolean = false) {

	return Parser.accept(rule, addCompletition, preserveToken);

}

/**
 * Conditionaly accepts token
 *
 * @param rule Match rule
 */
export function expect(rule: IParseMatchRule) {

	return Parser.expect(rule);

}

/**
 * Sequence parser
 *
 * @param parsers Parsers
 * @param terminator Termination rule - if error occurs, it will eat all tokens until reaches a terminator
 * @param process Post-processing function
 */
export function seq(parsers: Array<IParseFunction>, terminator?: IParseMatchRule, process?: (
	result: Array<any>,
	startToken: Token,
	endToken: Token
) => any) : IParseFunction {

	return (ctx: IParseContext) => {

		let startToken;
		const res = [];

		for (let i = 0; i < parsers.length; i++) {

			const ret = parsers[i](ctx);

			if (i === 0) {
				startToken = Parser.getToken();
			}

			if (ret === false) {

				// Eat until terminator
				if (terminator) {

					while(Parser.next()) {

						const token = Parser.getToken();

						if (terminator.match(token)) {
							break;
						}

					}

				}

				// Return
				return false;

			}

			res.push(ret);

		}

		// Expect terminator
		if (terminator && !expect(terminator)) {
			return false;
		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Optional block parser
 *
 * @param start Begin rule
 * @param parsers Parsers
 * @param end End rule (optional)
 * @param process Post-processing function
 */
export function block(start: IParseMatchRule, parsers: Array<IParseFunction>, end?: IParseMatchRule, process?: (
	result: Array<any>,
	startToken: Token,
	endToken: Token
) => any) : IParseFunction {

	return (ctx: IParseContext) => {

		let startToken;
		const res = [];

		// Accept start token
		if (!accept(start)) {
			return null;
		}

		startToken = Parser.getToken();

		// Parse body
		for (let i = 0; i < parsers.length; i++) {

			const ret = parsers[i](ctx);

			if (ret === false) {

				// Eat until end
				if (end) {

					while(Parser.next()) {

						const token = Parser.getToken();
						res.push(token);

						if (end.match(token)) {
							break;
						}

					}

				}

				// Return
				return false;

			}

			res.push(ret);

		}

		// Expect end
		if (end && !expect(end)) {
			return false;
		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Block parser
 *
 * @param start Begin rule
 * @param parsers Parsers
 * @param end End rule (optional)
 * @param process Post-processing function
 */
export function expectBlock(start: IParseMatchRule, parsers: Array<IParseFunction>, end?: IParseMatchRule, process?: (
	result: Array<any>,
	startToken: Token,
	endToken: Token
) => any) : IParseFunction {

	return (ctx: IParseContext) => {

		let startToken;
		const res = [];

		// Accept start token
		if (!expect(start)) {
			return false;
		}

		startToken = Parser.getToken();

		// Parse body
		for (let i = 0; i < parsers.length; i++) {

			const ret = parsers[i](ctx);

			if (ret === false) {

				// Eat until end
				if (end) {

					while(Parser.next()) {

						const token = Parser.getToken();
						res.push(token);

						if (end.match(token)) {
							break;
						}

					}

				}

				// Return
				return false;

			}

			res.push(ret);

		}

		// Expect end
		if (end && !expect(end)) {
			return false;
		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Accepts one of conditions
 *
 * @param parsers Parsers
 * @param process Post-processing function
 * @param preserveToken If to preserve token (eg. don't move to next one)
 */
export function expectOneOf(
	parsers: Array<{
		match: IParseMatchRule,
		do?: IParseFunction<any>,
		excludeHint?: boolean
	}>,
	process: (result: any) => any = null,
	preserveToken: boolean = false
) : IParseFunction<any> {

	return (ctx: IParseContext) => {

		// Add completitions
		for (let i = 0; i < parsers.length; i++) {
			Parser.addNextTokenDescriptor(parsers[i].match, true);
		}

		// Match items
		for (let i = 0; i < parsers.length; i++) {

			if (accept(parsers[i].match, false, preserveToken)) {

				const res = parsers[i].do ? parsers[i].do(ctx) : Parser.getToken();

				if (process) {
					return process(res);
				} else {
					return res;
				}

			}

		}

		// Otherwise report error
		const optionList = parsers
			.filter((p) => !p.excludeHint)
			.map((p) => p.match.label);

		Parser.next();
		const token = Parser.getToken();

		Parser.addError(
			DOC_ERROR_SEVERITY.ERROR,
			"Unexpected token",
			`Expecting one of ${optionList.join(" | ")}, got '${token ? token.type : "EOF"}'.`
		)

		return false;

	};

}

/**
 * Optionally accepts one of conditions
 *
 * @param parsers Parsers
 * @param process Post-processing function
 * @param preserveToken If to preserve token (eg. don't move to next one)
 */
export function oneOf(
	parsers: Array<{
		match: IParseMatchRule,
		do?: IParseFunction<any>,
		excludeHint?: boolean
	}>,
	process: (result: any) => any = null,
	preserveToken: boolean = false
) : IParseFunction<any> {

	return (ctx: IParseContext) => {

		// Add completitions
		for (let i = 0; i < parsers.length; i++) {
			Parser.addNextTokenDescriptor(parsers[i].match, true);
		}

		// Match items
		for (let i = 0; i < parsers.length; i++) {

			if (accept(parsers[i].match, false, preserveToken)) {

				const res = parsers[i].do ? parsers[i].do(ctx) : Parser.getToken();

				if (process) {
					return process(res);
				} else {
					return res;
				}

			}

		}

		return null;

	};

}

/**
 * Match rule optionally
 *
 * @param rule Parse match rule
 */
export function opt(rule: IParseMatchRule) {

	return (_ctx: IParseContext) => {

		if (accept(rule)) {
			return Parser.getToken();
		} else {
			return null;
		}

	};

}

/**
 * Expect rule to match
 *
 * @param rule Parse match rule
 * @param process Processing function
 */
export function e(
	rule: IParseMatchRule,
	process?: (
		token: Token
	) => any
) {

	return (_ctx: IParseContext) => {

		if (expect(rule)) {

			const token = Parser.getToken();
			return process ? process(token) : token;

		} else {

			return false;

		}

	};

}

/**
 * Matches any token until terminator reached
 *
 * @param terminator Termination rule
 * @param process Processing function
 */
export function anyUntil(
	terminator: IParseMatchRule,
	process?: (
		result: Array<any>,
		startToken: Token,
		endToken: Token
	) => any
) {

	return (_ctx: IParseContext) => {

		const res = [];
		let startToken;

		while(Parser.next()) {

			const token = Parser.getToken();
			res.push(token);

			if (!startToken) {
				startToken = token;
			}

			if (terminator.match(token)) {
				break;
			}

		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Repeats match function until null is returned or terminator is reached
 *
 * @param parser Parse function
 * @param process Processing function
 */
export function repeat(
	parser: IParseFunction<any>,
	process?: (
		result: Array<any>,
		startToken: Token,
		endToken: Token
	) => any
) {

	return (ctx: IParseContext) => {

		const res = [];
		let startToken;

		while(Parser.hasNextToken()) {

			const subResult = parser(ctx);

			if (!startToken) {
				startToken = Parser.getToken();
			}

			if (subResult === false) {
				return false;
			} else if (subResult === null) {
				break;
			} else {
				res.push(subResult);
			}

		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Repeats match function until null is returned or terminator is reached
 *
 * @param parser Parse function
 * @param terminator Termination symbol - repeat stops when this matches
 * @param process Processing function
 * @param preserveTerminatorToken If to preserver terminator token
 */
export function repeatUntil(
	parser: IParseFunction<any>,
	terminator: IParseMatchRule,
	process: (
		result: Array<any>,
		startToken: Token,
		endToken: Token
	) => any = null,
	preserveTerminatorToken: boolean = false
) {

	return (ctx: IParseContext) => {

		const res = [];
		const startToken = Parser.getToken();

		while(Parser.hasNextToken()) {

			if (terminator && Parser.accept(terminator, true, preserveTerminatorToken)) {
				break;
			}

			const subResult = parser(ctx);

			if (subResult === false) {
				return false;
			} else if (subResult === null) {
				break;
			} else {
				res.push(subResult);
			}

		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Repeat parser until it is precedded by a start token
 * Preserves start token by default.
 *
 * @param start Start symbol - is repeated while this matches
 * @param parser Parse function
 * @param process Processing function
 * @param preserveStartToken If to preserver start token
 */
export function repeatSince(
	start: IParseMatchRule,
	parser: IParseFunction<any>,
	process: (
		result: Array<any>,
		startToken: Token,
		endToken: Token
	) => any = null,
	preserveStartToken: boolean = true
) {

	return (ctx: IParseContext) => {

		const res = [];
		let startToken;

		while(Parser.accept(start, true, preserveStartToken)) {

			const subResult = parser(ctx);

			if (!startToken) {
				startToken = Parser.getToken();
			}

			if (subResult === false) {
				return false;
			} else if (subResult === null) {
				continue;
			} else {
				res.push(subResult);
			}

		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Parse list using delimited rule
 *
 * @param parser Parse function
 * @param delimiter Delimiter rule
 * @param process Processing function
 */
export function list(
	parser: IParseFunction<any>,
	delimiter: IParseMatchRule,
	process: (
		result: Array<any>,
		startToken: Token,
		endToken: Token
	) => any = null,
) {

	return (ctx: IParseContext) => {

		const res = [];
		let startToken = null;

		while(Parser.hasNextToken()) {

			const item = parser(ctx);

			if (!startToken) {
				startToken = Parser.getToken();
			}

			if (item === false) {
				return false;
			}

			res.push(item);

			if (!accept(delimiter)) {
				break;
			}

		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}

/**
 * Parse sequence only if starts with a token
 * Preserves start token by default.
 *
 * @param start Start token
 * @param parser Parse function
 * @param process Processing function
 * @param preserveStartToken If to preserve start token
 */
export function startsWith(
	start: IParseMatchRule,
	parsers: Array<IParseFunction>,
	process?: (
		result: Array<any>,
		startToken: Token,
		endToken: Token
	) => any,
	preserveStartToken: boolean = true
) : IParseFunction {

	return (ctx: IParseContext) => {

		let startToken;
		const res = [];

		// Accept start token
		if (!accept(start, true, preserveStartToken)) {
			return null;
		}

		startToken = Parser.getToken();

		// Parse body
		for (let i = 0; i < parsers.length; i++) {

			const ret = parsers[i](ctx);

			if (ret === false) {
				return false;
			}

			res.push(ret);

		}

		const endToken = Parser.getToken();

		if (process) {
			return process(res, startToken, endToken);
		} else {
			return res;
		}

	};

}