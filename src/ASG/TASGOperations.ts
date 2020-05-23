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

import { IASGDeclarationVariable } from "./IASGDeclarationVariable";
import { IASGOpInvoke } from "./IASGOpInvoke";
import { IASGOpSet } from "./IASGOpSet";

/**
 * Possible ASG operation statements
 */
export type TASGOperations = IASGDeclarationVariable|IASGOpInvoke|IASGOpSet;
