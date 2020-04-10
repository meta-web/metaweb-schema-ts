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
 * Parse match rule
 */
export interface IParseMatchRule {
	/** Label - helps error reporting and intellisense */
	label: string;
	/** Hint - helps error eporting and intellisense */
	hint?: string;
	/** Match function */
	match: (token: Token) => boolean;
	/** Autocomplete function - used to generate autocomplete options */
	autocomplete?: (outline: ISchemaOutline) => Array<ICompletionItem>;
}