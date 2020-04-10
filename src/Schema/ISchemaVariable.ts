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
 * Variable definition
 */
export interface ISchemaVariable extends ISchemaNode<NODE_TYPES.VARIABLE> {
	/** Variable identifier */
	id: string;

	/** Comment */
	cm: string;

	/** Type */
	t: TSchemaTypeExpression;

	/** Default value */
	v: TSchemaExpression|null;
}
