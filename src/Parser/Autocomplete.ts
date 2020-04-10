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

import { ISchemaOutline } from "../Analyzer/ISchemaOutline";
import { ICompletionItem, CMPL_ITEM_KIND } from "../Shared/ICompletionItem";

/**
 * Autocomplete function for identifiers
 *
 * @param outline Schema outline
 */
export function AutocompleteIdentifier(scope: Array<string> = []) {

	return (outline: ISchemaOutline) => {

		const items: Array<ICompletionItem> = [];

		items.push({
			kind: CMPL_ITEM_KIND.Variable,
			label: "Identifier1",
			detail: "Identifier 1 at " + scope.join(".")
		});

		items.push({
			kind: CMPL_ITEM_KIND.Variable,
			label: "Identifier2",
			detail: "Identifier 2 at " + scope.join(".")
		});

		return items;

	}

}
