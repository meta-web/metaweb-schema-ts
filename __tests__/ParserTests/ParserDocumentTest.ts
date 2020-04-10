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
import { readFileSync, writeFileSync, readFile } from "fs";
import path = require("path");

import { Parser } from "../../src/Parser/Parser";


chaiUse(chaiSubset);

// Base path
const docDir = path.resolve(path.dirname(__filename) + "/testDocuments");

// Dir options
const dirOpts = { depth: null, colors: true };

// Helper function to parse file
function testDocument(document: string) {

	const sourceFn = `${docDir}/${document}.meta`;
	const astTestFn = `${docDir}/${document}.ast.json`;
	const astOutFn = `${docDir}/out/${document}.ast.json`;

	// Read source
	const source = readFileSync(sourceFn, { encoding: "utf-8" });

	// Parse
	const docNode = Parser.parse(`file://${sourceFn}`, source);
	const errors = Parser.getErrors();

	// Write output AST for better debugging
	writeFileSync(astOutFn, JSON.stringify(docNode, null, 2), { encoding: "utf-8" });

	// Check errors
	if (errors.length > 0) {
		console.dir(Parser.getErrors(), dirOpts);
	}

	expect(errors.length).to.eq(0);

	// Compare AST
	const targetAst = JSON.parse(readFileSync(astTestFn, { encoding: "utf-8" }));
	expect(docNode).to.containSubset(targetAst);

}

describe("Parser > Documents", () => {

	it("Should parse types", () => {

		testDocument("types");

	});

	it("Should parse namespaces", () => {

		testDocument("namespaces");

	});

	it("Should parse imports", () => {

		testDocument("imports");

	});

	it("Should parse uses", () => {

		testDocument("uses");

	});

	it("Should parse translations", () => {

		testDocument("translations");

	});

});
