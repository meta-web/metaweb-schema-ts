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

import { ISchemaNode } from "./ISchemaNode";
import { NODE_TYPES } from "./NodeTypes";
import { TSchemaExpression } from "./TSchemaExpression";

/**
 * Condition element
 */
export interface ISchemaConditionElement {
	/** When (if) expression */
	w: TSchemaExpression;
	/** Then expression */
	t: TSchemaExpression;
}

/**
 * Condition definition
 */
export interface ISchemaCondition extends ISchemaNode<NODE_TYPES.CONDITION> {
	/** Conditions */
	c: Array<ISchemaConditionElement>;
	/** Default expression */
	d: TSchemaExpression;
}
