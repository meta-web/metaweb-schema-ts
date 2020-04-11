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
import { IASTSchemaNamespace } from "./IASTSchemaNamespace";
import { IASTSchemaImport } from "./IASTSchemaImport";
import { IASTSchemaUse } from "./IASTSchemaUse";

/**
 * Schema document
 */
export interface IASTSchemaDocument extends IASTSchemaNode<AST_NODE_TYPES.DOCUMENT> {
	/** Imports */
	im: Array<IASTSchemaImport>;

	/** Schema namespaces */
	ns: Array<IASTSchemaNamespace>;
}