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

/**
 * Parser and analyzer error codes
 */
export enum ERROR_CODE {
	/* Syntax errors (10xx) */
	UNEXPECTED_TOKEN = "1010",
	UNEXPECTED_EOF = "1011",
	INVALID_SYNTAX = "1020",
	INVALID_SYNTAX_ACTION_REF = "1021",
	/* Semantic symbol errors (20xx) */
	DUPLICATE_IDENTIFIER = "2010",
	DUPLICATE_IDENTIFIER_TYPE = "2011",
	DUPLICATE_IDENTIFIER_SCHEMA = "2012",
	DUPLICATE_RETURN = "2013"
	/* Semantic type errors (21xx) */
}
