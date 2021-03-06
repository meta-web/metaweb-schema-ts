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

import { AST_NODE_TYPES } from "./ASTNodeTypes";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Base schema node
 */
export interface IASTSchemaNode<NodeType = AST_NODE_TYPES> {
	/** Node type */
	n: NodeType,

	/** Optional parse info */
	parseInfo?: {
		range: IDocumentRange;
	}
}
