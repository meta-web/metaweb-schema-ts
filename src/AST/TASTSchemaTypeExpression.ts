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

import { IASTSchemaTypeStruct } from "./IASTSchemaTypeStruct";
import { IASTSchemaTypeOneOf } from "./IASTSchemaTypeOneOf";
import { IASTSchemaTypeAllOf } from "./IASTSchemaTypeAllOf";
import { IASTSchemaRefType } from "./IASTSchemaRefType";

/**
 * Type expression nodes
 */
export type TASTSchemaTypeExpression =
	IASTSchemaTypeStruct|IASTSchemaTypeOneOf|IASTSchemaTypeAllOf|IASTSchemaRefType;
