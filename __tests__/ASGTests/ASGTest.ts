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

import { Parser } from "../../src/Parser/Parser";
import { ParseNamespaceDeclaration, ParseDocument, ParseTypeDeclaration, ParseTypeReference, ParseTypeStruct, ParseTypeExpression } from "../../src/Parser/Grammar/Grammar";
import { ASG_TYPE } from "../../src/ASG/ASGNodeTypes";
import { IASGDocument } from "../../src/ASG/IASGDocument";
import { IParseFunction } from "../../src/Parser/Grammar/GrammarUtil";

import {
	ASGCreateDocument,
	ASGCreateNamespace,
	ASGCreateTypeDeclaration,
	ASGCreateRefType,
	ASGCreateTypeStruct,
	ASGCreateTypeExpressionNode
} from "../../src/ASG/ASGFactories";

chaiUse(chaiSubset);

// Dir options
const dirOpts = { depth: null, colors: true };

function parse(parseFunction: IParseFunction, code: string) {

	Parser.feed(code);

	const ast = parseFunction({});
	const errors = Parser.getErrors();

	if (errors.length > 0) {
		console.dir(errors, dirOpts);
	}

	expect(errors.length).to.eq(0);

	return ast;

}

describe("ASG > Factories", () => {

	it("Should create document", () => {

		const ast = parse(ParseDocument, ``);
		const asg = ASGCreateDocument("doc:doc", ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DOCUMENT,
			parent: null,
			id: "doc:doc",
			documentUri: "doc:doc",
			namespaces: {},
			refs: []
		} as IASGDocument);

	});

	it("Should create namespace(s)", () => {

		const ast = parse(ParseNamespaceDeclaration, `A.B {
			namespace C.D {}
			namespace C.D {}
		}`);

		const asg = ASGCreateNamespace(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.NAMESPACE,
			id: "A",
			refs: [],
			types: {},
			schemas: {},
			translations: {},
			parseInfo: {
				id: [ { start: { line: 1, col: 1 }, end: { line: 1, col: 2 } } ]
			},
			namespaces: {
				B: {
					node: ASG_TYPE.NAMESPACE,
					id: "B",
					refs: [],
					types: {},
					schemas: {},
					translations: {},
					parseInfo: {
						id: [ { start: { line: 1, col: 3 }, end: { line: 1, col: 4 } } ]
					},
					namespaces: {
						C: {
							node: ASG_TYPE.NAMESPACE,
							id: "C",
							refs: [],
							types: {},
							schemas: {},
							translations: {},
							parseInfo: {
								id: [
									{ start: { line: 2, col: 14 }, end: { line: 2, col: 15 } },
									{ start: { line: 3, col: 14 }, end: { line: 3, col: 15 } }
								]
							},
							namespaces: {
								D: {
									node: ASG_TYPE.NAMESPACE,
									id: "D",
									refs: [],
									types: {},
									schemas: {},
									translations: {},
									namespaces: {},
									parseInfo: {
										id: [
											{ start: { line: 2, col: 16 }, end: { line: 2, col: 17 } },
											{ start: { line: 3, col: 16 }, end: { line: 3, col: 17 } }
										]
									},
								}
							}
						}
					}
				}
			}
		});
	});

	it("Should create type reference", () => {

		const ast = parse(ParseTypeReference, `NS.List<String>`);
		const asg = ASGCreateRefType(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_TYPE,
			id: "List",
			refs: [],
			namespaceDef: [ "NS" ],
			namespaceRef: null,
			params: [{
				node: ASG_TYPE.REF_TYPE,
				id: "String",
				refs: [],
				namespaceDef: [],
				namespaceRef: null,
				params: [],
				typeDesc: null,
				parseInfo: {
					id: { start: { line: 1, col: 9 }, end: { line: 1, col: 15 } },
					ns: []
				}
			}],
			typeDesc: null,
			parseInfo: {
				id: { start: { line: 1, col: 4 }, end: { line: 1, col: 8 } },
				ns: [
					{ start: { line: 1, col: 1 }, end: { line: 1, col: 3 } }
				]
			}
		});

	});

	it("Should create type struct", () => {

		const ast = parse(ParseTypeStruct, `{
			prop1: String;
			prop2: Number;
		}`);

		const asg = ASGCreateTypeStruct(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.TYPE_STRUCT,
			id: null,
			refs: [],
			props: {
				prop1: {
					node: ASG_TYPE.REF_TYPE,
					id: "String",
				},
				prop2: {
					node: ASG_TYPE.REF_TYPE,
					id: "Number",
				}
			},
			typeDesc: null,
			parseInfo: {
				props: {
					prop1: { start: { line: 2, col: 4 }, end: { line: 2, col: 9 } },
					prop2: { start: { line: 3, col: 4 }, end: { line: 3, col: 9 } }
				}
			}
		});

	});

	it("Should create type one of", () => {

		const ast = parse(ParseTypeExpression, `A|B`);
		const asg = ASGCreateTypeExpressionNode(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.TYPE_ONEOF,
			id: null,
			refs: [],
			types: [{
				node: ASG_TYPE.REF_TYPE,
				id: "A"
			}, {
				node: ASG_TYPE.REF_TYPE,
				id: "B"
			}],
			typeDesc: null
		});

	});

	it("Should create type all of", () => {

		const ast = parse(ParseTypeExpression, `A&B`);
		const asg = ASGCreateTypeExpressionNode(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.TYPE_ALLOF,
			id: null,
			refs: [],
			types: [{
				node: ASG_TYPE.REF_TYPE,
				id: "A"
			}, {
				node: ASG_TYPE.REF_TYPE,
				id: "B"
			}],
			typeDesc: null
		});

	});

	it("Should create type declaration", () => {

		const ast = parse(ParseTypeDeclaration, `MyType = String;`);
		const asg = ASGCreateTypeDeclaration(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_TYPE,
			id: "MyType",
			refs: [],
			typeDef: {
				node: ASG_TYPE.REF_TYPE,
				id: "String",
				refs: [],
				namespaceDef: [],
				namespaceRef: null,
				params: [],
				typeDesc: null,
				parseInfo: {
					id: { start: { line: 1, col: 10 }, end: { line: 1, col: 16 } },
					ns: []
				}
			},
			typeDesc: null,
			parseInfo: {
				id: { start: { line: 1, col: 1 }, end: { line: 1, col: 7 } }
			}
		});

	});

	it.skip("Complex namespace example (just debug)", () => {

		const ast = parse(ParseDocument, `
		namespace My.Name.Space {
			type MyType = String;
		}

		namespace My.Name {
			type AnotherType = Map<String|Number>|String;
		}
		`);
		const asg = ASGCreateDocument(null, ast);

		console.dir(asg, dirOpts);

	});

	it.skip("Complex type expression example (just debug)", () => {

		const ast = parse(ParseTypeExpression, `(Map<Number, {
			prop1: String;
		}> & Map<String, Number>)|Boolean|AnotherType`);
		const asg = ASGCreateTypeExpressionNode(null, ast);

		console.dir(asg, dirOpts);

	});

});