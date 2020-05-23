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
import { IASTSchemaGenericList } from "./IASTSchemaGenerics";
import { IASTSchemaReturn } from "./IASTSchemaReturn";
import { IASTSchemaVariable } from "./IASTSchemaVariable";
import { IASTSchemaAction } from "./IASTSchemaAction";
import { IASTSchemaParam } from "./IASTSchemaParams";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Schema
 */
export interface IASTSchema extends IASTSchemaNode<AST_NODE_TYPES.SCHEMA> {
	/** Schema identifier */
	id: string;

	/** Comment */
	cm: string;

	/** Schema generics */
	g: IASTSchemaGenericList;

	/** Parameters */
	p: {
		[K: string]: IASTSchemaParam
	};

	/** Body expressions */
	b: Array<IASTSchemaVariable|IASTSchemaAction|IASTSchemaReturn>;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange,
		id: IDocumentRange
	}
}
