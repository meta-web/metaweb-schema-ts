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
import { TSchemaTypeExpression } from "./TSchemaTypeExpression";

/**
 * Scalar type sub-types
 */
export enum SCHEMA_SCALAR_SUBTYPE {
	STRING = "s",
	INTEGER = "i",
	FLOAT = "f",
	NUMBER = "n",
	BOOL = "b",
	DATE = "d"
}

/**
 * Scalar type
 */
export interface ISchemaTypeScalar extends ISchemaNode<NODE_TYPES.TYPE_SCALAR> {
	/** Scalar sub-type */
	t: SCHEMA_SCALAR_SUBTYPE;
}
