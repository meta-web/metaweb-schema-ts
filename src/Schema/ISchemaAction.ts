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
import { ISchemaParamList } from "./ISchemaParams";
import { ISchemaVariable } from "./ISchemaVariable";
import { ISchemaUpdate } from "./ISchemaUpdate";
import { ISchemaInvoke } from "./ISchemaInvoke";

/**
 * Schema action definition
 */
export interface ISchemaAction extends ISchemaNode<NODE_TYPES.SCHEMA_ACTION> {
	/** Schema identifier */
	id: string;

	/** Comment */
	cm: string;

	/** Parameters */
	p: ISchemaParamList;

	/** Override */
	o: boolean;

	/** Body expressions */
	b: Array<ISchemaVariable|ISchemaUpdate|ISchemaInvoke>;
}
