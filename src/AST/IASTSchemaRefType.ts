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
import { IDocumentRange } from "../Shared/IDocumentRange";
import { TASTSchemaTypeExpression } from "./TASTSchemaTypeExpression";

/**
 * Reference to a type
 */
export interface IASTSchemaRefType extends IASTSchemaNode<AST_NODE_TYPES.REF_TYPE> {
	/** Referenced type namespace */
	ns: Array<string>;

	/** Referenced type identifier */
	r: string;

	/** Type parameters */
	p: Array<TASTSchemaTypeExpression>;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange;
		ns: Array<IDocumentRange>;
		r: IDocumentRange;
	}
}
