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
import { ISchemaTypeParameterList } from "./ISchemaTypeParameters";

/**
 * Reference to a type
 */
export interface ISchemaRefType extends ISchemaNode<NODE_TYPES.REF_TYPE> {
	/** Referenced type namespace */
	ns: Array<string>;

	/** Referenced type identifier */
	r: string;

	/** Type parameters */
	p: ISchemaTypeParameterList;
}
