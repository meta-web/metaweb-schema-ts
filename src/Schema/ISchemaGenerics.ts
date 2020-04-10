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
import { NODE_TYPES } from ".";
import { TSchemaTypeExpression } from "./TSchemaTypeExpression";

/**
 * Schema generic
 */
export interface ISchemaGeneric extends ISchemaNode<NODE_TYPES.GENERIC> {
	/** Identifier */
	id: string;

	/* Extends expression */
	ex: TSchemaTypeExpression;

	/** Default type */
	df: TSchemaTypeExpression;
}

/**
 * List of schema generics
 */
export interface ISchemaGenericList extends Array<ISchemaGeneric> {};
