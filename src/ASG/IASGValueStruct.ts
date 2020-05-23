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
 * ASG struct value
 */
export interface IASGValueStruct extends IASGNode<ASG_TYPE.VAL_STRUCT> {
	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Properties */
	props: {
		[K: string]: TASGValueExpressionNode;
	}

	/** Parse info */
	parseInfo?: {
		/** Position of the value definition */
		range: IDocumentRange;

		/** Property ranges */
		props: { [K: string]: IDocumentRange };
	}
}