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

import { AST_NODE_TYPES } from "./ASTNodeTypes";
import { IASTSchemaNode } from "./IASTSchemaNode";

/**
 * Schema import
 */
export interface IASTSchemaImport extends IASTSchemaNode<AST_NODE_TYPES.IMPORT> {
	/** Import URI */
	u: string;
}
