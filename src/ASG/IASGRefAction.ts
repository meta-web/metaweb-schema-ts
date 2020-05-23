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
import { IASGNamespace } from "./IASGNamespace";
import { TASGTypeExpressionNode } from "./TASGTypeExpression";
import { TASGValueExpressionNode } from "./TASGValueExpression";

/**
 * ASG action reference
 */
export interface IASGRefAction extends IASGNode<ASG_TYPE.REF_ACTION> {
	/** Referenced schema */
	target: TASGValueExpressionNode;

	/** Action name */
	actionName: string;

	/** Parse info */
	parseInfo?: {
		/** Position of type definition */
		actionName: IDocumentRange;
	}
}