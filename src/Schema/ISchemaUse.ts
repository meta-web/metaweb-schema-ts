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

import { NODE_TYPES } from "./NodeTypes";
import { ISchemaNode } from "./ISchemaNode";

/**
 * Schema use
 */
export interface ISchemaUse extends ISchemaNode<NODE_TYPES.USE> {
	/** Use namespace */
	ns: Array<string>;
}
