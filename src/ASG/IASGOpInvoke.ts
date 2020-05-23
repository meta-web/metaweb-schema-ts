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
import { IASGNode } from "./IASGNode";
import { IDocumentRange } from "../Shared/IDocumentRange";
import { IASGRefAction } from "./IASGRefAction";
import { IASGCallArgument } from "./IASGCallArgument";

/**
 * ASG Invoke operation
 */
export interface IASGOpInvoke extends IASGNode<ASG_TYPE.OP_INVOKE> {
	/** Referenced action */
	action: IASGRefAction;

	/** Call arguments */
	args: Array<IASGCallArgument>;

	/** Parse info */
	parseInfo?: {
		/** Position of an invoke statement */
		range: IDocumentRange;
	}
}