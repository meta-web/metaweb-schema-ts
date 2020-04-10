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
import { NODE_TYPES, TSchemaTypeExpression } from ".";
import { TSchemaExpression } from "./TSchemaExpression";

/**
 * Schema params
 */
export interface ISchemaParam extends ISchemaNode<NODE_TYPES.SCHEMA_PARAM> {
	/** Identifier */
	id: string;

	/* Type expression */
	t: TSchemaTypeExpression;

	/** Default value */
	v: TSchemaExpression;

	/** If spread (rest) parameters */
	r: boolean;
}

/**
 * List of schema params
 */
export interface ISchemaParamList extends Array<ISchemaParam> {};
