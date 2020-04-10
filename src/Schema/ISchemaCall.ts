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
import { TSchemaExpression } from "./TSchemaExpression";
import { ISchemaTypeParameterList } from "./ISchemaTypeParameters";

/**
 * Schema call definition
 */
export interface ISchemaCall extends ISchemaNode<NODE_TYPES.CALL> {
	/** Schema name to call */
	s: TSchemaExpression;

	/** Type parameters */
	p: ISchemaTypeParameterList;

	/** Call arguments */
	a: ISchemaCallArgumentList;
}
