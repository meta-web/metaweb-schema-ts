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

import { IDocumentPosition } from "./IDocumentPosition";

/**
 * Document range
 */
export interface IDocumentRange {
	start: IDocumentPosition,
	end: IDocumentPosition
}
