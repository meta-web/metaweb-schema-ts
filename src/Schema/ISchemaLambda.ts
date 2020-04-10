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
import { ISchemaParamList } from "./ISchemaParams";
import { TSchemaExpression } from "./TSchemaExpression";

/**
 * Schema lambda function
 */
export interface ISchemaLambda extends ISchemaNode<NODE_TYPES.LAMBDA> {
	/** Parameters */
	p: ISchemaParamList;

	/** Body expressions */
	b: TSchemaExpression;
}
