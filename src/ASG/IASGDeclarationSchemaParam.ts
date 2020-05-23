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
 * ASG Schema param declaration
 */
export interface IASGDeclarationSchemaParam extends IASGNode<ASG_TYPE.DL_SCHEMA_PARAM> {
	/** Symbol identifier */
	id: string;

	/** Parameter type */
	typeDef: TASGTypeExpressionNode;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Default value */
	defaultValue: TASGValueExpressionNode;

	/** If is a rest (spread) parameter */
	rest: boolean;

	/** Parse info */
	parseInfo?: {
		/** Position of type identifier */
		id: IDocumentRange
	}
}