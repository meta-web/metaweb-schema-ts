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
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Base schema node
 */
export interface ISchemaNode<NodeType = NODE_TYPES> {
	/** Node type */
	n: NodeType,

	/** Optional parse info */
	parseInfo?: {
		range: IDocumentRange;
	}
}
