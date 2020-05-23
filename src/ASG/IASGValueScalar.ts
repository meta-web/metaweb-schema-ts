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
import { TScalarValue } from "../Shared/TScalarValue";
import { TASGTypeExpressionNode } from "./TASGTypeExpression";

/**
 * ASG scalar value
 */
export interface IASGValueScalar extends IASGNode<ASG_TYPE.VAL_SCALAR> {
	/** Value type */
	typeDef: TASGTypeExpressionNode;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Value */
	value: TScalarValue;

	/** Parse info */
	parseInfo?: {
		/** Position of value definition */
		range: IDocumentRange;
	}
}