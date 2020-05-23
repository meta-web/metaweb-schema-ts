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
import { IASTSchemaRefType } from "./IASTSchemaRefType";
import { TScalarValue } from "../Shared/TScalarValue";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Constant definition
 */
export interface IASTSchemaScalar extends IASTSchemaNode<AST_NODE_TYPES.SCALAR> {
	/** Constant type */
	t: IASTSchemaRefType;

	/** Value */
	v: TScalarValue;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange
	}
}
