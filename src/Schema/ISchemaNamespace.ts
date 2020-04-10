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
import { ISchema } from "./ISchema";
import { ISchemaType } from ".";
import { ISchemaUse } from "./ISchemaUse";
import { ISchemaTranslation } from "./ISchemaTranslation";

/**
 * Schema namespace
 */
export interface ISchemaNamespace extends ISchemaNode<NODE_TYPES.NAMESPACE> {
	/** Namespace identifier */
	id: Array<string>;

	/** Comment */
	cm: string;

	/** Use(s) */
	us: Array<ISchemaUse>;

	/** Nested Schema namespaces */
	ns: Array<ISchemaNamespace>;

	/** Schemas */
	s: Array<ISchema>;

	/** Types */
	t: Array<ISchemaType>;

	/** Translations */
	l: Array<ISchemaTranslation>;
}
