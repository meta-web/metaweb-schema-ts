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

import { IASTSchemaRefParam } from "./IASTSchemaRefParam";
import { IASTSchemaRefVariable } from "./IASTSchemaRefVariable";
import { IASTSchemaVariable } from "./IASTSchemaVariable";
import { IASTSchemaCall } from "./IASTSchemaCall";
import { IASTSchemaConst } from "./IASTSchemaConst";
import { IASTSchemaLambda } from "./IASTSchemaLambda";
import { IASTSchemaCondition } from "./IASTSchemaCondition";
import { IASTSchemaRefProperty } from "./IASTSchemaRefProperty";
import { IASTSchemaValueList } from "./IASTSchemaValueList";
import { IASTSchemaValueStruct } from "./IASTSchemaValueStruct";
import { ISchemaRefTranslation } from "./IASTSchemaRefTranslation";
import { IASTSchemaConditionType } from "./IASTSchemaConditionType";
import { IASTSchemaRefSchema } from "./IASTSchemaRefSchema";
import { IASTSchemaRefAction } from "./IASTSchemaRefAction";

/**
 * Schema expression nodes
 */
export type TASTSchemaExpression = IASTSchemaConst|IASTSchemaValueList|IASTSchemaValueStruct|IASTSchemaRefAction
	|IASTSchemaRefParam|IASTSchemaRefVariable|IASTSchemaVariable|IASTSchemaRefProperty|ISchemaRefTranslation|IASTSchemaRefSchema
	|IASTSchemaCall|IASTSchemaLambda|IASTSchemaCondition|IASTSchemaConditionType;
