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

import { TASTSchemaExpression, AST_NODE_TYPES } from ".";
import { IASTSchemaNode } from "./IASTSchemaNode";

/**
 * Schema call argument
 */
export interface IASTSchemaCallArgument extends IASTSchemaNode<AST_NODE_TYPES.CALL_ARGUMENT> {
	/** Identifier */
	id: string;

	/** Value */
	v: TASTSchemaExpression;

	/** If spread (rest) parameters */
	r: boolean;
}

/**
 * List of schema call arguments
 */
export interface ISchemaCallArgumentList extends Array<IASTSchemaCallArgument> {};
