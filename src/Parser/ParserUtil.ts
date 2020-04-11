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
import { IDocumentPosition } from "../Shared/IDocumentPosition";
import { IDocumentRange } from "../Shared/IDocumentRange";

/**
 * Creates position object from a token
 *
 * @param token Token
 */
export function tokenToPosition(token: Token) : IDocumentPosition {

	return token ? {
		line: token.line,
		col: token.col
	} : {
		line: 1,
		col: 1
	};

}

/**
 * Creates range object from a token
 *
 * @param token Token
 * @param token Optional end token
 */
export function tokenToRange(token: Token, endToken?: Token) : IDocumentRange {

	const startTokenPos = tokenToPosition(token);
	const endTokenPos = endToken ? tokenToPosition(endToken) : null;

	const endPos = endToken ? {
		line: endTokenPos.line,
		col: endTokenPos.col + endToken.text.length
	} : {
		line: startTokenPos.line,
		col: startTokenPos.col + token.text.length
	};

	return {
		start: startTokenPos,
		end: endPos
	}

}
