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
import { AST_NODE_TYPES } from "./ASTNodeTypes";
import { TASTSchemaTypeExpression } from "./TASTSchemaTypeExpression";
import { IASTSchemaGenericList } from "./IASTSchemaGenerics";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Schema
 */
export interface IASTSchemaType extends IASTSchemaNode<AST_NODE_TYPES.TYPE> {
	/** Type identifier */
	id: string;

	/** Type generics */
	g: IASTSchemaGenericList;

	/** Type declaration */
	t: TASTSchemaTypeExpression;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange,
		id: IDocumentRange
	}
}
