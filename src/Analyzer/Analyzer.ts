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

import { IASTSchemaDocument } from "../AST";
import { IDocumentError, DOC_ERROR_SEVERITY, IDocumentErrorMap, IDocumentErrorRelatedInformation } from "../Shared/IDocumentError";
import { IDocumentRange } from "../Shared/IDocumentRange";
import { ASGCreateDocument } from "./ASGFactories";
import { ERROR_CODE } from "../Shared/ErrorCodes";

/**
 * Analyzer options
 */
export interface IAnalyzerOpts {

}

/**
 * Semantic analyzer
 */
export class Analyzer {

	/** Document errors */
	private static docErrors: IDocumentErrorMap = {};

	/** Current document URI */
	private static currDocumentUri: string = null;

	/**
	 * Clear analyzer status and all documents
	 */
	public static clear() {

		Analyzer.docErrors = {};
		Analyzer.currDocumentUri = null;

	}

	/**
	 * INTERNAL: Sets analyzer current document URI
	 * Used only for testing and debugging, don't use directly!
	 *
	 * @param documentUri Document URI
	 */
	public static internal_SetCurrentDocumentUri(documentUri: string) {

		Analyzer.currDocumentUri = documentUri;

	}

	/**
	 * Returns URI of a currently processed document
	 */
	public static getCurrentDocumentUri() {

		return Analyzer.currDocumentUri;

	}

	/**
	 * Adds a document to an analyzer and creates ASG
	 *
	 * @param uri Document URI
	 * @param docNode Document AST node
	 */
	public static addDocument(uri: string, docNode: IASTSchemaDocument) {

		// Clear old errors
		if (Analyzer.docErrors[uri]) {
			Analyzer.docErrors[uri] = [];
		}

		Analyzer.currDocumentUri = uri;
		const asg = ASGCreateDocument(uri, docNode);

	}

	/**
	 * Adds an error to a current document
	 *
	 * @param severity Error severity
	 * @param name Name
	 * @param message Message
	 * @param range Document range
	 * @param relatedInformation Related error information
	 */
	public static addError(
		severity: DOC_ERROR_SEVERITY,
		name: ERROR_CODE,
		message: string,
		range: IDocumentRange,
		relatedInformation?: Array<IDocumentErrorRelatedInformation>
	) {

		if (!Analyzer.currDocumentUri) {
			throw new Error("Cannot call addError outside document processing.");
		}

		if (!Analyzer.docErrors[Analyzer.currDocumentUri]) {
			Analyzer.docErrors[Analyzer.currDocumentUri] = [];
		}

		Analyzer.docErrors[Analyzer.currDocumentUri].push({
			range: range,
			name: name,
			message: message,
			severity: severity,
			relatedInformation: relatedInformation
		});

	}

	/**
	 * Returns document errors
	 */
	public static getAllDocumentErrors() {

		return Analyzer.docErrors;

	}

	/**
	 * Returns errors of a specific document
	 *
	 * @param uri Document URI
	 */
	public static getDocumentErrors(uri: string) {

		return Analyzer.docErrors[uri] || [];

	}

	/**
	 * Returns errors of a currently processed document
	 */
	public static getCurrentDocumentErrors() {

		if (!Analyzer.currDocumentUri) {
			throw new Error("Current document is not set.");
		}

		return Analyzer.docErrors[Analyzer.currDocumentUri] || [];

	}

}
