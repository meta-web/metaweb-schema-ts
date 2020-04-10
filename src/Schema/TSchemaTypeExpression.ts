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

import { ISchemaTypeStruct } from "./ISchemaTypeStruct";
import { ISchemaTypeScalar } from "./ISchemaTypeScalar";
import { ISchemaTypeOneOf } from "./ISchemaTypeOneOf";
import { ISchemaTypeAllOf } from "./ISchemaTypeAllOf";
import { ISchemaRefSchema } from "./ISchemaRefSchema";
import { ISchemaRefType } from "./ISchemaRefType";

/**
 * Type expression nodes
 */
export type TSchemaTypeExpression =
	ISchemaTypeScalar|ISchemaTypeStruct
	|ISchemaTypeOneOf|ISchemaTypeAllOf|ISchemaRefSchema|ISchemaRefType;
