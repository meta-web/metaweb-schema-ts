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
import { IDocumentError } from "../Shared/IDocumentError";
import { ITokenDescriptorList } from "../Parser/ITokenDescriptor";
import { IDocumentPosition } from "../Shared/IDocumentPosition";

/**
 * Document processing report
 */
export interface IDocumentReport {
	/** Document URI */
	uri: string;

	/** Document source code */
	source: string;

	/** Parsed document node */
	documentNode: IASTSchemaDocument;

	/** Document errors */
	errors: Array<IDocumentError>;

	/** Token descriptors */
	tokenDescriptors: ITokenDescriptorList;

	/** Token –> AST node index */
	tokenToAstIndex?: Array<{
		start: IDocumentPosition,
		end: IDocumentPosition,
		node: any;
	}>;
}
