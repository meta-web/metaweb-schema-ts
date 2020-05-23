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

import { IASTSchemaNode } from "./IASTSchemaNode";
import { AST_NODE_TYPES } from ".";
import { TASTSchemaTypeExpression } from "./TASTSchemaTypeExpression";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Schema generic
 */
export interface IASTSchemaGeneric extends IASTSchemaNode<AST_NODE_TYPES.GENERIC> {
	/** Identifier */
	id: string;

	/* Extends expression */
	ex: TASTSchemaTypeExpression;

	/** Default type */
	df: TASTSchemaTypeExpression;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange,
		id: IDocumentRange
	}
}

/**
 * List of schema generics
 */
export interface IASTSchemaGenericList extends Array<IASTSchemaGeneric> {};
