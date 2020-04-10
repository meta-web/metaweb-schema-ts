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
import { ICompletionItem } from "../Shared/ICompletionItem";
import { ISchemaOutline } from "../Analyzer/ISchemaOutline";

/**
 * Token descriptor
 */
export interface ITokenDescriptor {
	/** Token */
	token: Token;

	/** Label - helps error reporting and intellisense */
	label: string;

	/** Hint - helps error eporting and intellisense */
	hint: Array<string>;

	/** Associated autocomplete function */
	autocomplete: Array<(outline: ISchemaOutline) => Array<ICompletionItem>>;
}

/**
 * List of token descriptors for lines. Array index represents a line number.
 *
 * Yes there will be many empty elements.
 */
export interface ITokenDescriptorList extends Array<Array<ITokenDescriptor>> {}
