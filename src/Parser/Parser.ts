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
import { lexerStates } from "./ParserConsts";
import { IParseMatchRule } from "./IParseMatchRule";
import { ITokenDescriptor, ITokenDescriptorList } from "./ITokenDescriptor";
import { ParseDocument } from "./Grammar/Grammar";
import { IDocumentError, DOC_ERROR_SEVERITY } from "../Shared/IDocumentError";
import { tokenToRange } from "./ParserUtil";
import { IDocumentRange } from "../Shared/IDocumentRange";
import { IParseTableEntry, PARSE_OP_TYPE } from "./IParseTableEntry";

/**
 * Parser class
 */
export class Parser {

	/** Lexer instance */
	private static lexer: Moo.Lexer = Moo.states(lexerStates);

	/** Previous token */
	private static prevToken: Moo.Token;

	/** Current token */
	private static currentToken: Moo.Token;

	/** Next token */
	private static nextToken: Moo.Token;

	/** Token descriptors - for debugging and intellisense */
	private static tokenDescriptors: ITokenDescriptorList;

	/** Errors */
	private static errors: Array<IDocumentError>;

	/** Parse table - for debugging */
	private static parseTable: Array<IParseTableEntry>;

	/**
	 * Resets parser state
	 */
	public static reset() {

		Parser.prevToken = null;
		Parser.currentToken = null;
		Parser.nextToken = null;
		Parser.tokenDescriptors = [];
		Parser.errors = [];
		Parser.parseTable = [];

	}

	/**
	 * Parse meta schema
	 *
	 * @param documentUri Document URI
	 * @param source Source code
	 */
	public static parse(documentUri: string, source: string) {

		Parser.reset();

		Parser.lexer.reset(source);
		Parser.nextToken = Parser.lexer.next();

		return ParseDocument({});

	}

	/**
	 * Feeds source in - resets state!
	 * Used for internal purposes, use Parser.parse()
	 *
	 * @param source Source text
	 */
	public static feed(source: string) {

		Parser.reset();

		Parser.lexer.reset(source);
		Parser.nextToken = Parser.lexer.next();

	}

	/**
	 * Returns current token
	 */
	public static getToken() {

		return Parser.currentToken;

	}

	/**
	 * Adds a token descriptor
	 *
	 * @param token Token
	 * @param rule Match rule
	 * @param addCompletition If to add completition items
	 */
	private static addTokenDescriptor(token: Moo.Token, rule: IParseMatchRule, addCompletition: boolean) {

		let line;
		let col;

		if (token) {
			line = token.line;
			col = token.col;
		} else {
			line = 0;
			col = 0;
		}

		const lineEntries = Parser.tokenDescriptors[line]
			? Parser.tokenDescriptors[line]
			: Parser.tokenDescriptors[line] = [];

		const entry = lineEntries[col] ? lineEntries[col] : lineEntries[col] = {
			label: null,
			hint: [],
			autocomplete: [],
			token: token
		};

		entry.label = rule.label;
		entry.hint = rule.hint ? [ rule.hint ] : [];

		if (addCompletition && rule.autocomplete) {
			entry.autocomplete.push(rule.autocomplete);
		}

	}

	/**
	 * Returs token descriptors
	 */
	public static getTokenDescriptors() {

		return Parser.tokenDescriptors;

	}

	/**
	 * Add descriptor to a next token
	 * @param rule Match rule
	 * @param addCompletition If to add completition items
	 */
	public static addNextTokenDescriptor(rule: IParseMatchRule, addCompletition: boolean = true) {

		if (Parser.nextToken) {
			Parser.addTokenDescriptor(Parser.nextToken, rule, addCompletition);
		}

	}

	/**
	 * Add descriptor to a next token
	 * @param rule Match rule
	 * @param addCompletition If to add completition items
	 */
	public static addCurrentTokenDescriptor(rule: IParseMatchRule, addCompletition: boolean = true) {

		if (Parser.currentToken) {
			Parser.addTokenDescriptor(Parser.currentToken, rule, addCompletition);
		}

	}

	/**
	 * Tries to return a next lexer token
	 */
	private static getNextLexerToken() {

		try {

			return Parser.lexer.next();

		} catch (err) {

			this.addError(DOC_ERROR_SEVERITY.ERROR, "Unexpected token", "Invalid syntax.");
			return null;

		}

	}

	/**
	 * Conditionaly accepts token
	 *
	 * @param rule Match rule
	 * @param addCompletition If to add completition items
	 * @param preserveToken If to preserve token (eg. don't move to next one)
	 */
	public static accept(rule: IParseMatchRule, addCompletition: boolean = true, preserveToken: boolean = false) {

		if (Parser.currentToken) {
			Parser.addTokenDescriptor(Parser.currentToken, rule, addCompletition);
		}

		if (Parser.nextToken) {
			Parser.addTokenDescriptor(Parser.nextToken, rule, addCompletition);
		}

		Parser.parseTable.push({
			type: PARSE_OP_TYPE.ACCEPT,
			token: Parser.nextToken,
			rule: rule
		});

		if (Parser.nextToken && rule.match(Parser.nextToken)) {

			if (!preserveToken) {
				Parser.prevToken = Parser.currentToken;
				Parser.currentToken = Parser.nextToken;
				Parser.nextToken = Parser.getNextLexerToken();
			}

			return true;

		} else {

			return false;

		}

	}

	/**
	 * Conditionaly accepts token
	 *
	 * @param rule Match rule
	 * @param addCompletition If to add completition items
	 */
	public static expect(rule: IParseMatchRule, addCompletition: boolean = true) {

		if (Parser.nextToken) {
			Parser.addTokenDescriptor(Parser.nextToken, rule, addCompletition);
		}

		Parser.prevToken = Parser.currentToken;
		Parser.currentToken = Parser.nextToken;
		Parser.nextToken = Parser.getNextLexerToken();

		Parser.parseTable.push({
			type: PARSE_OP_TYPE.EXPECT,
			token: Parser.currentToken,
			rule: rule
		});

		if (!Parser.currentToken) {

			Parser.errors.push({
				range: Parser.prevToken ? tokenToRange(Parser.prevToken) : {
					start: { line: 1, col: 1 },
					end: { line: 1, col: 1 }
				},
				name: "Unexpected end of input",
				message: `${rule.label} expected.`,
				severity: DOC_ERROR_SEVERITY.ERROR
			});

			return false;

		} else if (!rule.match(Parser.currentToken)) {

			Parser.errors.push({
				range: tokenToRange(Parser.currentToken),
				name: `Unexpected token`,
				message: `${rule.label} expected, got '${Parser.currentToken.type}'.`,
				severity: DOC_ERROR_SEVERITY.ERROR
			});

			return false;

		}

		return true;

	}

	/**
	 * Moves cursor to a next token
	 */
	public static next() {

		Parser.prevToken = Parser.currentToken;
		Parser.currentToken = Parser.nextToken;
		Parser.nextToken = Parser.getNextLexerToken();

		Parser.parseTable.push({
			type: PARSE_OP_TYPE.NEXT,
			token: Parser.currentToken,
			rule: null
		});

		if (Parser.nextToken) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Returns if a parsing stream has a next token
	 */
	public static hasNextToken() {

		return Parser.nextToken ? true : false;

	}

	/**
	 * Returns current or previous token (if available)
	 */
	public static getLastKnownToken() {

		return Parser.currentToken ? Parser.currentToken : Parser.prevToken ? Parser.prevToken : null;

	}

	/**
	 * Adds a document error
	 *
	 * @param severity Severity
	 * @param name Error name (code)
	 * @param message Message
	 * @param range Document range (current token is used when not provided)
	 */
	public static addError(severity: DOC_ERROR_SEVERITY, name: string, message: string, range?: IDocumentRange) {

		const token = Parser.getLastKnownToken();

		Parser.errors.push({
			range: range ? range : token ? tokenToRange(token) : {
				start: { line: 1, col: 1 },
				end: { line: 1, col: 1 }
			},
			name: name,
			message: message,
			severity: severity
		});

	}

	/**
	 * Returns parser errors
	 */
	public static getErrors() {

		return Parser.errors;

	}

	/**
	 * Returns parse table
	 */
	public static getParseTable() {

		return Parser.parseTable;

	}

}
