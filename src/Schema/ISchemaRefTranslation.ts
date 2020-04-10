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
import { ISchemaCallArgumentList } from "./ISchemaCallArguments";

/**
 * Reference to a translation term
 */
export interface ISchemaRefTranslation extends ISchemaNode<NODE_TYPES.REF_TRANSLATION> {
	/** Referenced namespace */
	ns: Array<string>;

	/** Referenced translation identifier */
	r: string;

	/** Call arguments */
	a: ISchemaCallArgumentList;
}
