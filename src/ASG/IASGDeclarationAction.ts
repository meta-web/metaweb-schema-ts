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
import { IASGDeclarationSchemaParam } from "./IASGDeclarationSchemaParam";
import { TASGOperations } from "./TASGOperations";

/**
 * ASG Action declaration
 */
export interface IASGDeclarationAction extends IASGNode<ASG_TYPE.DL_ACTION> {
	/** Symbol identifier */
	id: string;

	/** Parameters */
	params: { [K: string]: IASGDeclarationSchemaParam; }

	/** Body statements (is procedural) */
	body: Array<TASGOperations>;

	/** If overrides another action */
	override: boolean;

	/** Parse info */
	parseInfo?: {
		/** Position of type identifier */
		id: IDocumentRange
	}
}