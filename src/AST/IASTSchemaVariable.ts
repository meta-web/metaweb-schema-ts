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
import { TASTSchemaExpression } from "./TASTSchemaExpression";
import { TASTSchemaTypeExpression } from "./TASTSchemaTypeExpression";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Variable definition
 */
export interface IASTSchemaVariable extends IASTSchemaNode<AST_NODE_TYPES.VARIABLE> {
	/** Variable identifier */
	id: string;

	/** Comment */
	cm: string;

	/** Type */
	t: TASTSchemaTypeExpression;

	/** Default value */
	v: TASTSchemaExpression|null;

	/** If a variable is statefull */
	st: boolean;

	/** If a variable is inherited */
	in: boolean;

	/** If a variable is propagated */
	pr: boolean;

	/** Parse info */
	parseInfo?: {
		range: IDocumentRange,
		id: IDocumentRange
	}
}
