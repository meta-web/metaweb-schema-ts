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
 * ASG type one of
 */
export interface IASGTypeOneOf extends IASGNode<ASG_TYPE.TYPE_ONEOF> {
	/** Sub types */
	types: Array<TASGTypeExpressionNode>;

	/** Resolved type descriptor @todo */
	typeDesc: any;
}
