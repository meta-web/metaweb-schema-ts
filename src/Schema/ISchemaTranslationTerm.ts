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

import { ISchemaNode } from "./ISchemaNode";
import { NODE_TYPES } from "./NodeTypes";
import { ISchemaCallArgumentList } from "./ISchemaCallArguments";
import { ISchemaParamList } from "./ISchemaParams";
import { TSchemaExpression } from "./TSchemaExpression";

/**
 * Reference to a translation term
 */
export interface ISchemaTranslationTerm extends ISchemaNode<NODE_TYPES.TRANSLATION_TERM> {
	/** Term ID (can be sub-namespaced) */
	id: Array<string>;

	/** Parameters */
	p: ISchemaParamList;

	/** Value expressions */
	v: TSchemaExpression;
}
