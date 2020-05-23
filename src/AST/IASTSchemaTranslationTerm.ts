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

import { IASTSchemaNode } from "./IASTSchemaNode";
import { AST_NODE_TYPES } from "./ASTNodeTypes";
import { IASTSchemaParam } from "./IASTSchemaParams";
import { TASTSchemaExpression } from "./TASTSchemaExpression";

/**
 * Reference to a translation term
 */
export interface IASTSchemaTranslationTerm extends IASTSchemaNode<AST_NODE_TYPES.TRANSLATION_TERM> {
	/** Term ID (can be sub-namespaced) */
	id: Array<string>;

	/** Parameters */
	p: {
		[K: string]: IASTSchemaParam
	};

	/** Value expressions */
	v: TASTSchemaExpression;
}
