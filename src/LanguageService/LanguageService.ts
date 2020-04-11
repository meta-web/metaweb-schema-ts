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

import { IDocumentReport } from "./IDocumentReport";
import { ISchemaOutline } from "../Analyzer/ISchemaOutline";
import { Parser } from "../Parser/Parser";
import { IDocumentPosition } from "../Shared/IDocumentPosition";
import { ITokenDescriptor } from "../Parser/ITokenDescriptor";
import { EventEmitter } from "../Shared/EventEmitter";
import { IDocumentUpdateEvent } from "./IDocumentUpdateEvent";
import { IASTSchemaNode } from "../AST/IASTSchemaNode";
import * as IS from "../AST";
import { AST_NODE_TYPES } from "../AST";

/**
 * Language service configuration
 */
export interface ILanguageServiceConfig {
	/** Enable debug mode (creates more detailted diagnostics) */
	debug?: boolean;
}

/**
 * Language service
 *
 * Provides parsing, analyzing and diagnostics for language servers.
 */
export class LanguageService extends EventEmitter<"documentUpdate", IDocumentUpdateEvent> {

	/** Processed documents */
	private documents: { [K: string] : IDocumentReport } = {};

	/** Schema(s) outline */
	private outline: ISchemaOutline;

	/**
	 * Service constructor
	 *
	 * @param config Configuration
	 */
	public constructor(
		private config: ILanguageServiceConfig
	) {

		super();

	}

	/**
	 * Creates token -> AST index, used for debugging
	 * @param rootNode Schema node
	 */
	private createTokenAstIndex(rootNode: IASTSchemaNode) {

		const index = [];

		const indexNode = (node: IASTSchemaNode) => {

			if (!node) {
				return;
			}

			if (node.parseInfo) {
				index.push({
					start: node.parseInfo.range.start,
					end: node.parseInfo.range.end,
					node: node
				});
			}

			switch(node.n) {
				case AST_NODE_TYPES.SCHEMA:
					((node as IS.IASTSchema).g || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchema).p || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchema).b || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.SCHEMA_ACTION:
					((node as IS.IASTSchemaAction).p || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchemaAction).b || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.CALL:
					indexNode((node as IS.IASTSchemaCall).s);
					((node as IS.IASTSchemaCall).a || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.CALL_ARGUMENT:
					indexNode((node as IS.IASTSchemaCallArgument).v);
					break;
				case AST_NODE_TYPES.CONDITION:
					(node as IS.IASTSchemaCondition).c.forEach((n) => {
						indexNode(n.w);
						indexNode(n.t);
					});
					indexNode((node as IS.IASTSchemaCondition).d);
					break;
				case AST_NODE_TYPES.CONDITION_TYPE:
					indexNode((node as IS.IASTSchemaConditionType).v);
					indexNode((node as IS.IASTSchemaConditionType).t);
					break;
				case AST_NODE_TYPES.DOCUMENT:
					((node as IS.IASTSchemaDocument).im || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchemaDocument).ns || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.GENERIC:
					indexNode((node as IS.IASTSchemaGeneric).df);
					indexNode((node as IS.IASTSchemaGeneric).ex);
					break;
				case AST_NODE_TYPES.INVOKE:
					indexNode((node as IS.IASTSchemaInvoke).s);
					((node as IS.IASTSchemaInvoke).a || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.LAMBDA:
					((node as IS.IASTSchemaLambda).p || []).forEach((n) => indexNode(n));
					indexNode((node as IS.IASTSchemaLambda).b);
					break;
				case AST_NODE_TYPES.NAMESPACE:
					((node as IS.IASTSchemaNamespace).ns || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchemaNamespace).us || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchemaNamespace).s || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchemaNamespace).t || []).forEach((n) => indexNode(n));
					((node as IS.IASTSchemaNamespace).l || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.SCHEMA_PARAM:
					indexNode((node as IS.IASTSchemaParam).t);
					indexNode((node as IS.IASTSchemaParam).v);
					break;
				case AST_NODE_TYPES.REF_ACTION:
					indexNode((node as IS.IASTSchemaRefAction).r);
					break;
				case AST_NODE_TYPES.REF_PROPERTY:
					indexNode((node as IS.IASTSchemaRefProperty).i);
					indexNode((node as IS.IASTSchemaRefProperty).v);
					break;
				case AST_NODE_TYPES.REF_SCHEMA:
				case AST_NODE_TYPES.REF_TYPE:
					((node as IS.IASTSchemaRefType).p || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.REF_TRANSLATION:
					((node as IS.ISchemaRefTranslation).a || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.TRANSLATION:
					((node as IS.IASTSchemaTranslation).t || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.TRANSLATION_TERM:
					((node as IS.IASTSchemaTranslationTerm).p || []).forEach((n) => indexNode(n));
					indexNode((node as IS.IASTSchemaTranslationTerm).v);
					break;
				case AST_NODE_TYPES.TYPE_ALLOF:
				case AST_NODE_TYPES.TYPE_ONEOF:
					((node as IS.IASTSchemaTypeAllOf|IS.IASTSchemaTypeOneOf).t || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.TYPE_PARAM:
					indexNode((node as IS.IASTSchemaTypeParameter).t);
					break;
				case AST_NODE_TYPES.TYPE_STRUCT:
					Object.keys((node as IS.IASTSchemaTypeStruct).p).forEach((k) => indexNode((node as IS.IASTSchemaTypeStruct).p[k]));
					break;
				case AST_NODE_TYPES.UPDATE:
					indexNode((node as IS.IASTSchemaUpdate).r);
					indexNode((node as IS.IASTSchemaUpdate).v);
					break;
				case AST_NODE_TYPES.VALUE_LIST:
					((node as IS.IASTSchemaValueList).e || []).forEach((n) => indexNode(n));
					break;
				case AST_NODE_TYPES.VALUE_STRUCT:
					Object.keys((node as IS.IASTSchemaValueStruct).p).forEach((k) => indexNode((node as IS.IASTSchemaValueStruct).p[k]));
					break;
				case AST_NODE_TYPES.VARIABLE:
					indexNode((node as IS.IASTSchemaVariable).t);
					indexNode((node as IS.IASTSchemaVariable).v);
					break;
			}

		};

		indexNode(rootNode);

		return index;

	}

	/**
	 * Analyze document using analyzer
	 *
	 * @param res Document report
	 */
	private analyzeDocument(res: IDocumentReport) : IDocumentReport {

		return res;

	}

	/**
	 * Processes a document
	 *
	 * @param uri Document UIR
	 * @param source Source code
	 */
	private processDocument(uri: string, source: string) : IDocumentReport {

		const docNode = Parser.parse(uri, source);

		const res : IDocumentReport = {
			uri: uri,
			source: source,
			documentNode: docNode,
			errors: Parser.getErrors(),
			tokenDescriptors: Parser.getTokenDescriptors(),
			tokenToAstIndex: this.config.debug ? this.createTokenAstIndex(docNode) : null
		};

		return this.analyzeDocument(res);

	}

	/**
	 * Adds a document
	 *
	 * @param uri Document URI
	 * @param source Source code
	 */
	public addDocument(uri: string, source: string) : IDocumentReport {

		const res = this.processDocument(uri, source);

		this.documents[uri] = res;

		this.emit("documentUpdate", {
			document: res
		});

		return res;

	}

	/**
	 * Removes a document
	 * @param uri Document URI
	 * @param source Source code
	 */
	public removeDocument(uri: string) {

		delete this.documents[uri];

	}

	/**
	 * Returns document processing result
	 *
	 * @param uri Document URI
	 */
	public getDocumentResult(uri: string) : IDocumentReport {

		return this.documents[uri] || null;

	}

	/**
	 * Returns a list of added documents
	 */
	public getDocumentList() {

		return Object.keys(this.documents);

	}

	/**
	 * Returns a token descriptor for a given document at position
	 *
	 * @param uri Document URI
	 * @param position Position
	 */
	public getTokenDescriptorAt(uri: string, position: IDocumentPosition) : ITokenDescriptor {

		const doc = this.documents[uri];

		// Document not found
		if (!doc) {
			return null;
		}

		// Line not found
		if (!doc.tokenDescriptors[position.line]) {
			return null;
		}

		// Find token
		let match = null;

		for (let tokenCol = 0; tokenCol < doc.tokenDescriptors[position.line].length; tokenCol++) {

			if (position.col > tokenCol && doc.tokenDescriptors[position.line][tokenCol]) {
				match = doc.tokenDescriptors[position.line][tokenCol];
			}

			if (position.col <= tokenCol) {
				break;
			}

		}

		return match;

	}

	/**
	 * Returns autocomplete items for a given document at position
	 *
	 * @param uri Document URI
	 * @param position Position
	 */
	public autocompleteAt(uri: string, position: IDocumentPosition) {

		const descriptor = this.getTokenDescriptorAt(uri, position);

		// Descriptor not found
		if (!descriptor) {
			return [];
		}

		// Create completition list
		const cpltItems = [];

		for (let i = 0; i < descriptor.autocomplete.length; i++) {

			const res = descriptor.autocomplete[i](this.outline);

			for (let j = 0; j < res.length; j++)
				cpltItems.push(res[j]);

		}

		return cpltItems;

	}

	/**
	 * Returns AST node at given position
	 * Debug mode must be enabled in order to have required data.
	 *
	 * @param uri Document URI
	 * @param position Document position
	 */
	public getNodeAt(uri: string, position: IDocumentPosition) {

		const doc = this.documents[uri];

		// Document not found
		if (!doc) {
			return null;
		}

		if (!doc.tokenToAstIndex) {
			return null;
		}

		const res : Array<IASTSchemaNode> = [];

		for (let i = 0; i < doc.tokenToAstIndex.length; i++) {

			const item = doc.tokenToAstIndex[i];

			if (
				item.start.line <= position.line &&
				item.start.col <= position.col &&
				item.end.line >= position.line &&
				(item.end.line !== item.start.line || (item.end.line === item.start.line && item.end.col > position.col))
			) {
				res.push(item.node);
			}

		}

		return res;

	}

}