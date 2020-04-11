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

/**
 * Possible constant value types
 */
export type TASTSchemaConstValue = string|number|boolean|Date|Array<TASTSchemaConstValue>
	|{ [K: string]: TASTSchemaConstValue, [K: number]: TASTSchemaConstValue };

/**
 * Constant definition
 */
export interface IASTSchemaConst extends IASTSchemaNode<AST_NODE_TYPES.CONST> {
	/** Constant type */
	t: IASTSchemaRefType;
	/** Value */
	v: TASTSchemaConstValue
}
