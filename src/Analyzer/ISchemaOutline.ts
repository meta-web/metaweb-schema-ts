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

import { IASTSchema } from "../AST";

/**
 * Namespace outline
 */
export interface ISchemaOutlineNamespace {
	namespaces: {
		[K: string]: ISchemaOutlineNamespace;
	},
	schemas: {
		[K: string]: ISchemaOutlineSchema;
	}
}

/**
 * Schema outline
 */
export interface ISchemaOutlineSchema {
	/** Schema node */
	schema: IASTSchema;
}

/**
 * General schema outline
 */
export interface ISchemaOutline extends ISchemaOutlineNamespace {}