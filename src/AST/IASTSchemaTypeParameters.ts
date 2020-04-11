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

/**
 * Type parameter
 */
export interface IASTSchemaTypeParameter extends IASTSchemaNode<AST_NODE_TYPES.TYPE_PARAM> {
	t: TASTSchemaTypeExpression;
}

/**
 * List of type parameters
 */
export interface IASTSchemaTypeParameterList extends Array<IASTSchemaTypeParameter> {}
