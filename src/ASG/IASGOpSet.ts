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
import { IASGRefVariable } from "./IASGRefVariable";
import { TASGTypeExpressionNode } from "./TASGTypeExpression";
import { TTypeDescriptor } from "../Shared/ITypeDescriptor";
import { TASGValueExpressionNode } from "./TASGValueExpression";

/**
 * ASG Set operation
 */
export interface IASGOpSet extends IASGNode<ASG_TYPE.OP_SET> {
	/** Referenced target */
	target: IASGRefVariable;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Value */
	value: TASGValueExpressionNode;

	/** Parse info */
	parseInfo?: {
		/** Position of a set statement */
		range: IDocumentRange;
	}
}