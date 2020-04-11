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
import { ISchemaCallArgumentList } from "./IASTSchemaCallArguments";
import { TASTSchemaExpression } from "./TASTSchemaExpression";
import { IASTSchemaTypeParameterList } from "./IASTSchemaTypeParameters";

/**
 * Schema call definition
 */
export interface IASTSchemaCall extends IASTSchemaNode<AST_NODE_TYPES.CALL> {
	/** Schema name to call */
	s: TASTSchemaExpression;

	/** Type parameters */
	p: IASTSchemaTypeParameterList;

	/** Call arguments */
	a: ISchemaCallArgumentList;
}
