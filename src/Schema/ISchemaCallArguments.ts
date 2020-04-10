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

import { TSchemaExpression, NODE_TYPES } from ".";
import { ISchemaNode } from "./ISchemaNode";

/**
 * Schema call argument
 */
export interface ISchemaCallArgument extends ISchemaNode<NODE_TYPES.CALL_ARGUMENT> {
	/** Identifier */
	id: string;

	/** Value */
	v: TSchemaExpression;

	/** If spread (rest) parameters */
	r: boolean;
}

/**
 * List of schema call arguments
 */
export interface ISchemaCallArgumentList extends Array<ISchemaCallArgument> {};
