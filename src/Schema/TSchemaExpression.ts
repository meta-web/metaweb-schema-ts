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

import { ISchemaRefParam } from "./ISchemaRefParam";
import { ISchemaRefVariable } from "./ISchemaRefVariable";
import { ISchemaVariable } from "./ISchemaVariable";
import { ISchemaCall } from "./ISchemaCall";
import { ISchemaConst } from "./ISchemaConst";
import { ISchemaLambda } from "./ISchemaLambda";
import { ISchemaCondition } from "./ISchemaCondition";
import { ISchemaRefProperty } from "./ISchemaRefProperty";
import { ISchemaValueList } from "./ISchemaValueList";
import { ISchemaValueStruct } from "./ISchemaValueStruct";
import { ISchemaRefTranslation } from "./ISchemaRefTranslation";
import { ISchemaConditionType } from "./ISchemaConditionType";
import { ISchemaRefSchema } from "./ISchemaRefSchema";

/**
 * Schema expression nodes
 */
export type TSchemaExpression = ISchemaConst|ISchemaValueList|ISchemaValueStruct
	|ISchemaRefParam|ISchemaRefVariable|ISchemaVariable|ISchemaRefProperty|ISchemaRefTranslation|ISchemaRefSchema
	|ISchemaCall|ISchemaLambda|ISchemaCondition|ISchemaConditionType;
