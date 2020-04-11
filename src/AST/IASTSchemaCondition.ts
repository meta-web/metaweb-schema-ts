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

/**
 * Condition element
 */
export interface IASTSchemaConditionElement {
	/** When (if) expression */
	w: TASTSchemaExpression;
	/** Then expression */
	t: TASTSchemaExpression;
}

/**
 * Condition definition
 */
export interface IASTSchemaCondition extends IASTSchemaNode<AST_NODE_TYPES.CONDITION> {
	/** Conditions */
	c: Array<IASTSchemaConditionElement>;
	/** Default expression */
	d: TASTSchemaExpression;
}
