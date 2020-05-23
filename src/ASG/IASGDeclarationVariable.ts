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
import { TASGTypeExpressionNode } from "./TASGTypeExpression";
import { TASGValueExpressionNode } from "./TASGValueExpression";
import { TTypeDescriptor } from "../Shared/ITypeDescriptor";

/**
 * ASG Variable declaration
 */
export interface IASGDeclarationVariable extends IASGNode<ASG_TYPE.DL_VARIABLE> {
	/** Symbol identifier */
	id: string;

	/** Parameter type */
	typeDef: TASGTypeExpressionNode;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Value */
	value: TASGValueExpressionNode;

	/** If is statefull */
	statefull: boolean;

	/** If is propagated */
	propagated: boolean;

	/** List of watch expressions */
	watch: Array<any>;

	/** Parse info */
	parseInfo?: {
		/** Position of type identifier */
		id: IDocumentRange
	}
}