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
import { NODE_TYPES, TSchemaExpression } from ".";
import { ISchemaRefVariable } from "./ISchemaRefVariable";

/**
 * Schema update statement
 */
export interface ISchemaUpdate extends ISchemaNode<NODE_TYPES.UPDATE> {
	/** Target variable node identifier */
	r: ISchemaRefVariable;

	/** Default value */
	v: TSchemaExpression;
}
