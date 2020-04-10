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
 * Document error
 */
export interface IDocumentError {
	/** Parse range where error occured */
	range: IDocumentRange;

	/** Severity */
	severity: DOC_ERROR_SEVERITY;

	/** Error name */
	name: string;

	/** Error message - used for better error reporting */
	message: string;
}
