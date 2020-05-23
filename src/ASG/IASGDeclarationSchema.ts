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
import { IASGDeclarationTypeParam } from "./IASGDeclarationTypeParam";
import { IASGDeclarationSchemaParam } from "./IASGDeclarationSchemaParam";
import { IASGDeclarationVariable } from "./IASGDeclarationVariable";
import { IASGDeclarationAction } from "./IASGDeclarationAction";
import { IASGDeclarationReturn } from "./IASGDeclarationReturn";
import { TTypeDescriptor } from "../Shared/ITypeDescriptor";

/**
 * ASG Schema declaration
 */
export interface IASGDeclarationSchema extends IASGNode<ASG_TYPE.DL_SCHEMA> {
	/** Symbol identifier */
	id: string;

	/** Generics */
	generics: Array<IASGDeclarationTypeParam>;

	/** Parameters */
	params: { [K: string]: IASGDeclarationSchemaParam; }

	/** Variables */
	variables: { [K: string]: IASGDeclarationVariable };

	/** Actions */
	actions: { [K: string]: IASGDeclarationAction };

	/** Return expression */
	return: IASGDeclarationReturn;

	/** Resolved type descriptor */
	typeDesc: TTypeDescriptor;

	/** Schema type descriptor Schema<self> */
	typeSchemaDesc: TTypeDescriptor;

	/** Parse info */
	parseInfo?: {
		/** Position of schema identifier */
		id: IDocumentRange
	}
}