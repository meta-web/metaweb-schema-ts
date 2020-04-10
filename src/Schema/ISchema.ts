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
import { ISchemaGenericList } from "./ISchemaGenerics";
import { ISchemaParamList } from "./ISchemaParams";
import { ISchemaReturn } from "./ISchemaReturn";
import { ISchemaVariable } from "./ISchemaVariable";
import { ISchemaAction } from "./ISchemaAction";

/**
 * Schema
 */
export interface ISchema extends ISchemaNode<NODE_TYPES.SCHEMA> {
	/** Schema identifier */
	id: string;

	/** Comment */
	cm: string;

	/** Schema generics */
	g: ISchemaGenericList;

	/** Parameters */
	p: ISchemaParamList;

	/** Body expressions */
	b: Array<ISchemaVariable|ISchemaAction|ISchemaReturn>;
}
