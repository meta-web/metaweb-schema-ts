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
 * One of types (or)
 */
export interface ISchemaTypeOneOf extends ISchemaNode<NODE_TYPES.TYPE_ONEOF> {
	/** Possible types */
	t: Array<TSchemaTypeExpression>;
}