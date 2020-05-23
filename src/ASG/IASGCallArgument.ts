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
import { TASGValueExpressionNode } from "./TASGValueExpression";
import { TTypeDescriptor } from "../Shared/ITypeDescriptor";

/**
 * ASG Call argument
 */
export interface IASGCallArgument extends IASGNode<ASG_TYPE.CALL_ARGUMENT> {
	/** Argument identifier */
	id: string;

	/** Resolved argument identifier */
	argName: string;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Argument value */
	value: TASGValueExpressionNode;

	/** If to unpack value to rest arguments */
	unpack: boolean;

	/** Parse info */
	parseInfo?: {
		/** Position of argument identifier */
		id: IDocumentRange;
		/** Position of an entire argument */
		range: IDocumentRange;
	}
}