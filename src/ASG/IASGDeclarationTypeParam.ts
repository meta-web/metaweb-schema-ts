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

/**
 * ASG Type declaration
 */
export interface IASGDeclarationTypeParam extends IASGNode<ASG_TYPE.DL_TYPE_PARAM> {
	/** Symbol identifier */
	id: string;

	/** Extends type definition node */
	extendsTypeDef: TASGTypeExpressionNode;

	/** Default type definition node */
	defaultTypeDef: TASGTypeExpressionNode;

	/** Parse info */
	parseInfo?: {
		/** Position of type identifier */
		id: IDocumentRange
	}
}