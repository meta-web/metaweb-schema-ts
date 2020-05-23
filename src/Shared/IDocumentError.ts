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

import { IDocumentRange } from "./IDocumentRange";
import { IDocumentLocation } from "./IDocumentLocation";
import { ERROR_CODE } from "./ErrorCodes";

/**
 * Error severity
 */
export enum DOC_ERROR_SEVERITY {
	ERROR = 1,
	WARNING = 2,
	INFO = 3,
	HINT = 4
}

/**
 * Error related information item
 */
export interface IDocumentErrorRelatedInformation {
	/** Document location */
	location: IDocumentLocation;

	/** Message */
	message: string;
}

/**
 * Document error
 */
export interface IDocumentError {
	/** Parse range where error occured */
	range: IDocumentRange;

	/** Severity */
	severity: DOC_ERROR_SEVERITY;

	/** Error name */
	name: ERROR_CODE;

	/** Error message - used for better error reporting */
	message: string;

	/** Related information */
	relatedInformation?: Array<IDocumentErrorRelatedInformation>;
}

/**
 * Map of errors to specific documents
 */
export interface IDocumentErrorMap {
	[documentUri: string]: Array<IDocumentError>;
}