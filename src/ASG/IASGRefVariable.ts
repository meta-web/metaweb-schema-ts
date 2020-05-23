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
import { IASGDeclarationVariable } from "./IASGDeclarationVariable";

/**
 * ASG variable reference
 */
export interface IASGRefVariable extends IASGNode<ASG_TYPE.REF_VARIABLE> {
	/** Referenced variable name */
	varName: string;

	/** Resolved variable node */
	varRef: IASGDeclarationVariable;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Parse info */
	parseInfo?: {
		/** Position of type definition */
		varName: IDocumentRange;
	}
}