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
import { ISchemaTypeScalar } from "./ISchemaTypeScalar";

/**
 * Possible constant value types
 */
export type TSchemaConstValue = string|number|boolean|Date|Array<TSchemaConstValue>
	|{ [K: string]: TSchemaConstValue, [K: number]: TSchemaConstValue };

/**
 * Constant definition
 */
export interface ISchemaConst extends ISchemaNode<NODE_TYPES.CONST> {
	/** Constant type */
	t: ISchemaTypeScalar;
	/** Value */
	v: TSchemaConstValue
}
