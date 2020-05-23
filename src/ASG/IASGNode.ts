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

import { ASG_TYPE } from "./ASGNodeTypes";

/**
 * ASG Base node
 */
export interface IASGNode<T extends ASG_TYPE = ASG_TYPE> {
	/** Node type */
	node: T;

	/** Parent node */
	parent?: IASGNode;

	/** Other nodes that reference this node */
	refs: Array<IASGNode>;

	/** Node description (eg. parsed from a comment) */
	description?: string;

	/** Additional long description (eg. parsed from a comment) */
	longDescription?: string;
}
