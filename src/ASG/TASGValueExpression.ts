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

import { IASGValueScalar } from "./IASGValueScalar";
import { IASGValueList } from "./IASGValueList";
import { IASGRefAction } from "./IASGRefAction";
import { IASGRefVariable } from "./IASGRefVariable";
import { IASGRefProperty } from "./IASGRefProperty";
import { IASGRefSchema } from "./IASGRefSchema";
import { IASGValueStruct } from "./IASGValueStruct";

/**
 * Possible ASG value expression nodes
 */
export type TASGValueExpressionNode = IASGValueScalar|IASGValueList|IASGValueStruct
	|IASGRefAction|IASGRefVariable|IASGRefProperty/*|IASGRefTranslation*/|IASGRefSchema
	/*|IASGSchemaCall|IASGLambda|IASGCondition|IASGConditionType*/;