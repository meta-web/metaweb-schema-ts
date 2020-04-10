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
import { ISchemaTranslationTerm } from "./ISchemaTranslationTerm";

/**
 * Reference to a translation term
 */
export interface ISchemaTranslation extends ISchemaNode<NODE_TYPES.TRANSLATION> {
	/** Language ID */
	id: string;

	/** Terms */
	t: Array<ISchemaTranslationTerm>;
}
