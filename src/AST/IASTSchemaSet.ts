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
import { AST_NODE_TYPES, TASTSchemaExpression } from ".";
import { IASTSchemaRefVariable } from "./IASTSchemaRefVariable";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Schema set statement
 */
export interface IASTSchemaSet extends IASTSchemaNode<AST_NODE_TYPES.SET> {
	/** Target variable node identifier */
	r: IASTSchemaRefVariable;

	/** New value */
	v: TASTSchemaExpression;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange;
	}
}
