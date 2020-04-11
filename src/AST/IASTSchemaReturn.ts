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
import { TASTSchemaExpression } from "./TASTSchemaExpression";
import { TASTSchemaTypeExpression } from "./TASTSchemaTypeExpression";

/**
 * Return statement definition
 */
export interface IASTSchemaReturn extends IASTSchemaNode<AST_NODE_TYPES.RETURN> {
	/** Comment */
	cm: string;

	/** Value expression */
	v: TASTSchemaExpression|null;
}
