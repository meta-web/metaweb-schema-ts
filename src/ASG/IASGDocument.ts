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

import { IASGNode } from "./IASGNode";
import { ASG_TYPE } from "./ASGNodeTypes";
import { IASGNamespace } from "./IASGNamespace";

/**
 * ASG Document
 */
export interface IASGDocument extends IASGNode<ASG_TYPE.DOCUMENT> {
	/** Document URI */
	documentUri: string;

	/** Document symbols */
	namespaces: {
		[K: string]: IASGNamespace
	};
}