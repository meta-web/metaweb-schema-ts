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

import { Token } from "moo";
import { IParseMatchRule } from "./IParseMatchRule";

/**
 * Parse operation type
 */
export enum PARSE_OP_TYPE {
	ACCEPT = "accept",
	EXPECT = "expect",
	NEXT = "next"
}

/**
 * Parse table entry
 */
export interface IParseTableEntry {
	type: PARSE_OP_TYPE;
	token: Token;
	rule?: IParseMatchRule;
}