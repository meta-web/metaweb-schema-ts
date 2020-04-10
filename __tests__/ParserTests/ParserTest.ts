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

import { NODE_TYPES, ISchemaRefType } from "../../src/Schema";
import { Parser } from "../../src/Parser/Parser";
import { ParseImportStatement, ParseDocument, ParseTypeReference, ParseStringTemplate } from "../../src/Parser/Grammar/Grammar";

chaiUse(chaiSubset);

// Dir options
const dirOpts = { depth: null, colors: true };

// Default namespace
const defaultNs = {
	n: NODE_TYPES.NAMESPACE,
	id: [ "__default__" ],
	cm: null,
	ns: [],
	us: [],
	s: [],
	t: [],
	l: []
};

describe("Parser > Parser", () => {

	it("Should accept IMPORT token", () => {

		Parser.feed("import");

		const res = Parser.accept({
			label: "import",
			hint: "Import statement",
			match: (token) => token.type === "import",
			autocomplete: () => [{
				label: "import"
			}]
		});

		expect(res).to.eq(true);

	});

	it("Should expect IMPORT token", () => {

		Parser.feed("import");

		expect(() => {
			Parser.expect({
				label: "import",
				hint: "Import statement",
				match: (token) => token.type === "import",
				autocomplete: () => [{
					label: "import"
				}]
			});
		}).to.not.throw();

	});

	it("Should parse empty document", () => {

		Parser.feed("");

		const res = ParseDocument({});

		expect(res).to.deep.contain({
			n: NODE_TYPES.DOCUMENT,
			im: [],
			ns: [ defaultNs ]
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse SINGLE-LINE COMMENT statement in a document", () => {

		Parser.feed("// comment");

		const res = ParseDocument({});

		expect(res).to.deep.contain({
			n: NODE_TYPES.DOCUMENT,
			im: [],
			ns: [ defaultNs ]
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse MULTI-LINE COMMENT statement in a document", () => {

		Parser.feed('/* this is\na comment */');

		const res = ParseDocument({});

		expect(res).to.deep.contain({
			n: NODE_TYPES.DOCUMENT,
			im: [],
			ns: [ defaultNs ]
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse IMPORT statement", () => {

		Parser.feed('"hello";');

		const res = ParseImportStatement({});

		expect(res).to.deep.contain({
			n: NODE_TYPES.IMPORT,
			u: "hello"
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse IMPORT statement in a document", () => {

		Parser.feed('import "hello";');

		const res = ParseDocument({});

		expect(res).to.containSubset({
			n: NODE_TYPES.DOCUMENT,
			im: [{
				n: NODE_TYPES.IMPORT,
				u: "hello"
			}],
			ns: [ defaultNs ]
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should report error when using invalid IMPORT statement", () => {

		Parser.feed('import somethingWrong;');

		const res = ParseDocument({});

		expect(res).to.containSubset({
			n: NODE_TYPES.DOCUMENT,
			im: [],
			ns: [ defaultNs ]
		});

		expect(Parser.getErrors().length).to.eq(1);

	});

	it("Should parse USE statement in a document", () => {

		Parser.feed('use Hello.World;');

		const res = ParseDocument({});

		expect(res).to.containSubset({
			n: NODE_TYPES.DOCUMENT,
			im: [],
			ns: [ {
				...defaultNs,
				us: [{
					n: NODE_TYPES.USE,
					ns: [ "Hello", "World" ]
				}]
			} ]
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse empty NAMESPACE declaration in a document", () => {

		Parser.feed('namespace My.Name.Space {}');

		const res = ParseDocument({});

		expect(res).to.containSubset({
			n: NODE_TYPES.DOCUMENT,
			im: [],
			ns: [ defaultNs, {
				n: NODE_TYPES.NAMESPACE,
				id: [ "My", "Name", "Space" ],
				cm: null,
				us: [],
				s: [],
				t: []
			} ]
		});

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse type reference", () => {

		Parser.feed('My.Name.Space.Type');

		const res = ParseTypeReference({});

		expect(res).to.containSubset({
			n: NODE_TYPES.REF_TYPE,
			p: [],
			ns: [ "My", "Name", "Space" ],
			r: "Type",
		} as ISchemaRefType);

		expect(Parser.getErrors().length).to.eq(0);

	});

	it("Should parse templated string", () => {

		Parser.feed('`Hello, \\`${name}\\` \\${name}!`');

		const res = ParseStringTemplate({});

		// console.dir(res, dirOpts);
		// console.dir(Parser.getErrors(), dirOpts);

		expect(Parser.getErrors().length).to.eq(0);

	});

});
