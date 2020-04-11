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

import { IASTSchemaNode } from "./IASTSchemaNode";
import { AST_NODE_TYPES } from "./ASTNodeTypes";
import { IASTSchemaParamList } from "./IASTSchemaParams";
import { IASTSchemaVariable } from "./IASTSchemaVariable";
import { IASTSchemaUpdate } from "./IASTSchemaUpdate";
import { IASTSchemaInvoke } from "./IASTSchemaInvoke";

/**
 * Schema action definition
 */
export interface IASTSchemaAction extends IASTSchemaNode<AST_NODE_TYPES.SCHEMA_ACTION> {
	/** Schema identifier */
	id: string;

	/** Comment */
	cm: string;

	/** Parameters */
	p: IASTSchemaParamList;

	/** Override */
	o: boolean;

	/** Body expressions */
	b: Array<IASTSchemaVariable|IASTSchemaUpdate|IASTSchemaInvoke>;
}
