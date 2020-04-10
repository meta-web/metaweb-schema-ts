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
import { ISchemaNode } from "../Schema/ISchemaNode";
import * as IS from "../Schema";
import { NODE_TYPES } from "../Schema";

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
	private createTokenAstIndex(rootNode: ISchemaNode) {

		const index = [];

		const indexNode = (node: ISchemaNode) => {

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
				case NODE_TYPES.SCHEMA:
					((node as IS.ISchema).g || []).forEach((n) => indexNode(n));
					((node as IS.ISchema).p || []).forEach((n) => indexNode(n));
					((node as IS.ISchema).b || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.SCHEMA_ACTION:
					((node as IS.ISchemaAction).p || []).forEach((n) => indexNode(n));
					((node as IS.ISchemaAction).b || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.CALL:
					indexNode((node as IS.ISchemaCall).s);
					((node as IS.ISchemaCall).a || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.CALL_ARGUMENT:
					indexNode((node as IS.ISchemaCallArgument).v);
					break;
				case NODE_TYPES.CONDITION:
					(node as IS.ISchemaCondition).c.forEach((n) => {
						indexNode(n.w);
						indexNode(n.t);
					});
					indexNode((node as IS.ISchemaCondition).d);
					break;
				case NODE_TYPES.CONDITION_TYPE:
					indexNode((node as IS.ISchemaConditionType).v);
					indexNode((node as IS.ISchemaConditionType).t);
					break;
				case NODE_TYPES.DOCUMENT:
					((node as IS.ISchemaDocument).im || []).forEach((n) => indexNode(n));
					((node as IS.ISchemaDocument).ns || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.GENERIC:
					indexNode((node as IS.ISchemaGeneric).df);
					indexNode((node as IS.ISchemaGeneric).ex);
					break;
				case NODE_TYPES.INVOKE:
					indexNode((node as IS.ISchemaInvoke).r);
					indexNode((node as IS.ISchemaInvoke).s);
					((node as IS.ISchemaInvoke).a || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.LAMBDA:
					((node as IS.ISchemaLambda).p || []).forEach((n) => indexNode(n));
					indexNode((node as IS.ISchemaLambda).b);
					break;
				case NODE_TYPES.NAMESPACE:
					((node as IS.ISchemaNamespace).ns || []).forEach((n) => indexNode(n));
					((node as IS.ISchemaNamespace).us || []).forEach((n) => indexNode(n));
					((node as IS.ISchemaNamespace).s || []).forEach((n) => indexNode(n));
					((node as IS.ISchemaNamespace).t || []).forEach((n) => indexNode(n));
					((node as IS.ISchemaNamespace).l || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.SCHEMA_PARAM:
					indexNode((node as IS.ISchemaParam).t);
					indexNode((node as IS.ISchemaParam).v);
					break;
				case NODE_TYPES.REF_PROPERTY:
					indexNode((node as IS.ISchemaRefProperty).i);
					indexNode((node as IS.ISchemaRefProperty).v);
					break;
				case NODE_TYPES.REF_SCHEMA:
				case NODE_TYPES.REF_TYPE:
					((node as IS.ISchemaRefType).p || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.REF_TRANSLATION:
					((node as IS.ISchemaRefTranslation).a || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.TRANSLATION:
					((node as IS.ISchemaTranslation).t || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.TRANSLATION_TERM:
					((node as IS.ISchemaTranslationTerm).p || []).forEach((n) => indexNode(n));
					indexNode((node as IS.ISchemaTranslationTerm).v);
					break;
				case NODE_TYPES.TYPE_ALLOF:
				case NODE_TYPES.TYPE_ONEOF:
					((node as IS.ISchemaTypeAllOf|IS.ISchemaTypeOneOf).t || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.TYPE_PARAM:
					indexNode((node as IS.ISchemaTypeParameter).t);
					break;
				case NODE_TYPES.TYPE_STRUCT:
					Object.keys((node as IS.ISchemaTypeStruct).p).forEach((k) => indexNode((node as IS.ISchemaTypeStruct).p[k]));
					break;
				case NODE_TYPES.UPDATE:
					indexNode((node as IS.ISchemaUpdate).r);
					indexNode((node as IS.ISchemaUpdate).v);
					break;
				case NODE_TYPES.VALUE_LIST:
					((node as IS.ISchemaValueList).e || []).forEach((n) => indexNode(n));
					break;
				case NODE_TYPES.VALUE_STRUCT:
					Object.keys((node as IS.ISchemaValueStruct).p).forEach((k) => indexNode((node as IS.ISchemaValueStruct).p[k]));
					break;
				case NODE_TYPES.VARIABLE:
					indexNode((node as IS.ISchemaVariable).t);
					indexNode((node as IS.ISchemaVariable).v);
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

		const res : Array<ISchemaNode> = [];

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