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

/**
 * ASG type reference
 */
export interface IASGRefType extends IASGNode<ASG_TYPE.REF_TYPE> {
	/** References namespace */
	namespaceDef: Array<string>;

	/** Resolved namespace */
	namespaceRef: IASGNamespace;

	/** Type parameters @todo */
	params: Array<TASGTypeExpressionNode>;

	/** Resolved type descriptor @todo */
	typeDesc: any;

	/** Parse info */
	parseInfo?: {
		/** Position of type definition */
		id: IDocumentRange;

		/** Namespace IDs */
		ns: Array<IDocumentRange>;
	}
}