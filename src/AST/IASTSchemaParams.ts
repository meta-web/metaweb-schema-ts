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
import { AST_NODE_TYPES, TASTSchemaTypeExpression } from ".";
import { TASTSchemaExpression } from "./TASTSchemaExpression";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Schema params
 */
export interface IASTSchemaParam extends IASTSchemaNode<AST_NODE_TYPES.SCHEMA_PARAM> {
	/** Identifier */
	id: string;

	/* Type expression */
	t: TASTSchemaTypeExpression;

	/** Default value */
	v: TASTSchemaExpression;

	/** If spread (rest) parameters */
	r: boolean;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange,
		id: IDocumentRange
	}
}
