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
import { TTypeDescriptor } from "../Shared/ITypeDescriptor";
import { TASGValueExpressionNode } from "./TASGValueExpression";

/**
 * ASG list value
 */
export interface IASGValueList extends IASGNode<ASG_TYPE.VAL_LIST> {
	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Value */
	value: Array<TASGValueExpressionNode>;

	/** Parse info */
	parseInfo?: {
		/** Position of the value definition */
		range: IDocumentRange;
	}
}