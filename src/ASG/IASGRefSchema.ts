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
import { TTypeDescriptor } from "../Shared/ITypeDescriptor";

/**
 * ASG schema reference
 */
export interface IASGRefSchema extends IASGNode<ASG_TYPE.REF_SCHEMA> {
	/** Referenced namespace */
	namespaceDef: Array<string>;

	/** Resolved namespace */
	namespaceRef: IASGNamespace;

	/** Referenced schema name */
	schemaName: string;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;
}