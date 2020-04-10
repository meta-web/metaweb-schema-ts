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

import "mocha";
import { expect, use as chaiUse } from "chai";
import chaiSubset = require('chai-subset');
import { LanguageService } from "../../src";

chaiUse(chaiSubset);

// Dir options
const dirOpts = { depth: null, colors: true };

describe("Language Service", () => {

	it("Should create token to AST index", () => {

		const ls = new LanguageService({
			debug: true
		});

		const doc = ls.addDocument("test", `
		schema MainView () {

			let name = TextProperty(
				maxLength: 32,
				required: true
			);

			return View(
				header: {
					title: $Other.header$,
					icon: "mdi/apps"
				},
				content: [
					Section(
						header: { title: $main.section(name: @name.value)$ },
						Text("Hello world"),
						name,
						Text($ImportedNamespace.importedString$)
					)
				]
			);

		}
		`)

		if (doc.errors.length > 0) {
			console.dir(doc.errors, dirOpts);
		}

		expect(doc.errors.length).to.eq(0);
		expect(doc.tokenToAstIndex.length).to.be.greaterThan(0);

		// console.dir(doc.documentNode, dirOpts);

		// const node = ls.getNodeAt("test", { line: 4, col: 10 });

		// console.dir(doc.tokenToAstIndex, dirOpts);
		// console.dir(node, dirOpts);

	});

});
