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
import { TSchemaTypeExpression } from "./TSchemaTypeExpression";

/**
 * Type condition element
 */
export interface ISchemaConditionType extends ISchemaNode<NODE_TYPES.CONDITION_TYPE> {
	/** Value to compare */
	v: TSchemaExpression;
	/** Type expression */
	t: TSchemaTypeExpression;
}
