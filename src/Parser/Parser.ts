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
import { ERROR_CODE } from "../Shared/ErrorCodes";

/**
 * Parser class
 */
export class Parser {

	/** Lexer instance */
	private static lexer: Moo.Lexer = Moo.states(lexerStates);

	/** Token buffer */
	private static tokenBuffer: Array<Moo.Token>;

	/** Current token position */
	private static tokenPos: number;

	/** Token descriptors - for debugging and intellisense */
	private static tokenDescriptors: ITokenDescriptorList;

	/** Buffer of errors */
	private static errorBuffer: Array<IDocumentError>;

	/** Errors */
	private static errors: Array<IDocumentError>;

	/** If to flush errors immediately */
	private static flushErrorsImmediately: boolean;

	/** Parse table - for debugging */
	private static parseTable: Array<IParseTableEntry>;

	/**
	 * Resets parser state
	 */
	public static reset() {

		Parser.tokenBuffer = [];
		Parser.tokenPos = -1;
		Parser.tokenDescriptors = [];
		Parser.errorBuffer = [];
		Parser.errors = [];
		Parser.flushErrorsImmediately = true;
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
		this.getNextToken();

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
		this.getNextToken();

	}

	/**
	 * Tries to return a next lexer token
	 */
	public static getNextToken() {

		try {

			if (Parser.tokenPos >= Parser.tokenBuffer.length - 1) {
				Parser.tokenBuffer.push(Parser.lexer.next());
			}

			return Parser.tokenBuffer[Parser.tokenPos + 1];

		} catch (err) {

			this.addError(DOC_ERROR_SEVERITY.ERROR, ERROR_CODE.UNEXPECTED_TOKEN, "Invalid syntax.");
			return null;

		}

	}

	/**
	 * Returns current token
	 */
	public static getToken() {

		return Parser.tokenBuffer[Parser.tokenPos];

	}

	/**
	 * Returns previous token
	 */
	public static getPrevToken() {

		if (Parser.tokenPos > 0) {
			return Parser.tokenBuffer[Parser.tokenPos - 1];
		} else {
			return null;
		}

	}

	/**
	 * Move token forward
	 */
	public static move() {

		if (Parser.tokenPos < Parser.tokenBuffer.length - 1) {
			Parser.tokenPos++;
		}

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

		if (Parser.getNextToken()) {
			Parser.addTokenDescriptor(Parser.getNextToken(), rule, addCompletition);
		}

	}

	/**
	 * Add descriptor to a next token
	 * @param rule Match rule
	 * @param addCompletition If to add completition items
	 */
	public static addCurrentTokenDescriptor(rule: IParseMatchRule, addCompletition: boolean = true) {

		if (Parser.getToken()) {
			Parser.addTokenDescriptor(Parser.getToken(), rule, addCompletition);
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

		const currToken = Parser.getToken();
		const nextToken = Parser.getNextToken();

		if (currToken) {
			Parser.addTokenDescriptor(currToken, rule, addCompletition);
		}

		if (nextToken) {
			Parser.addTokenDescriptor(nextToken, rule, addCompletition);
		}

		Parser.parseTable.push({
			type: PARSE_OP_TYPE.ACCEPT,
			token: nextToken,
			rule: rule
		});

		if (nextToken && rule.match(nextToken)) {

			if (!preserveToken) {
				Parser.move();
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

		const nextToken = Parser.getNextToken();

		if (nextToken) {
			Parser.addTokenDescriptor(nextToken, rule, addCompletition);
		}

		Parser.move();
		const currToken = Parser.getToken();
		const prevToken = Parser.getPrevToken();

		Parser.parseTable.push({
			type: PARSE_OP_TYPE.EXPECT,
			token: currToken,
			rule: rule
		});

		if (!currToken) {

			Parser.addError(
				DOC_ERROR_SEVERITY.ERROR,
				ERROR_CODE.UNEXPECTED_EOF,
				`${rule.label} expected.`,
				prevToken ? tokenToRange(prevToken) : {
					start: { line: 1, col: 1 },
					end: { line: 1, col: 1 }
				}
			);

			return false;

		} else if (!rule.match(currToken)) {

			Parser.addError(
				DOC_ERROR_SEVERITY.ERROR,
				ERROR_CODE.UNEXPECTED_TOKEN,
				`${rule.label} expected, got '${currToken.type}'.`,
				tokenToRange(currToken)
			);

			return false;

		}

		return true;

	}

	/**
	 * Moves cursor to a next token
	 */
	public static next() {

		if (Parser.hasNextToken()) {

			Parser.move();

			Parser.parseTable.push({
				type: PARSE_OP_TYPE.NEXT,
				token: Parser.getToken(),
				rule: null
			});

			return true;

		} else {
			return false;
		}

	}

	/**
	 * Returns if a parsing stream has a next token
	 */
	public static hasNextToken() {

		return Parser.getNextToken() ? true : false;

	}

	/**
	 * Returns token position
	 */
	public static getTokenPosition() {

		return Parser.tokenPos;

	}

	/**
	 * Sets token position
	 *
	 * Can be used to move back or forward in parsing.
	 * Can be used to implement lookahead parsing
	 * @param pos New position
	 */
	public static setTokenPosition(pos: number) {

		if (pos < 0 || pos >= Parser.tokenBuffer.length - 1) {
			throw new Error("Position is out of range.");
		}

		Parser.tokenPos = pos;

	}

	/**
	 * Returns current or previous token (if available)
	 */
	public static getLastKnownToken() {

		const currToken = Parser.getToken();
		const prevToken = Parser.getPrevToken();

		return currToken ? currToken : prevToken ? prevToken : null;

	}

	/**
	 * Sets if to flush errors immediately
	 *
	 * @param value New flag value
	 */
	public static setFlushErrors(value: boolean) {

		Parser.flushErrorsImmediately = value;

	}

	/**
	 * Adds a document error
	 *
	 * @param severity Severity
	 * @param name Error name (code)
	 * @param message Message
	 * @param range Document range (current token is used when not provided)
	 */
	public static addError(severity: DOC_ERROR_SEVERITY, name: ERROR_CODE, message: string, range?: IDocumentRange) {

		const token = Parser.getLastKnownToken();

		Parser.errorBuffer.push({
			range: range ? range : token ? tokenToRange(token) : {
				start: { line: 1, col: 1 },
				end: { line: 1, col: 1 }
			},
			name: name,
			message: message,
			severity: severity
		});

		if (Parser.flushErrorsImmediately) {
			Parser.flushErrors();
		}

	}

	/**
	 * Flushes errors from buffer
	 */
	public static flushErrors() {

		for (let i = 0; i < Parser.errorBuffer.length; i++) {
			Parser.errors.push(Parser.errorBuffer[i]);
		}

		Parser.clearErrorBuffer();

	}

	/**
	 * Clears buffer of errors
	 */
	public static clearErrorBuffer() {

		Parser.errorBuffer = [];

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
