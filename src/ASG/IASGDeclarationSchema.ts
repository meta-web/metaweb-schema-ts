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

/**
 * ASG Schema declaration
 */
export interface IASGDeclarationSchema extends IASGNode<ASG_TYPE.DL_SCHEMA> {
	/** Generics @todo */
	generics: Array<any>;

	/** Parameters @todo */
	params: { [K: string]: any; }

	/** Variables @todo */
	variables: Array<any>;

	/** Actions @todo */
	actions: { [K: string]: any };

	/** Return expression @todo */
	return: any;

	/** Resolved type descriptor @todo */
	typeDesc: any;

	/** Schema type descriptor Schema<self> */
	typeSchemaDesc: any;

	/** Parse info */
	parseInfo?: {
		/** Position of type identifier */
		id: IDocumentRange
	}
}