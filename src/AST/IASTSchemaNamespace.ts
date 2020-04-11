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
import { IASTSchema } from "./IASTSchema";
import { IASTSchemaType } from ".";
import { IASTSchemaUse } from "./IASTSchemaUse";
import { IASTSchemaTranslation } from "./IASTSchemaTranslation";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Schema namespace
 */
export interface IASTSchemaNamespace extends IASTSchemaNode<AST_NODE_TYPES.NAMESPACE> {
	/** Namespace identifier */
	id: Array<string>;

	/** Comment */
	cm: string;

	/** Use(s) */
	us: Array<IASTSchemaUse>;

	/** Nested Schema namespaces */
	ns: Array<IASTSchemaNamespace>;

	/** Schemas */
	s: Array<IASTSchema>;

	/** Types */
	t: Array<IASTSchemaType>;

	/** Translations */
	l: Array<IASTSchemaTranslation>;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange,
		id: Array<IDocumentRange>
	}
}
