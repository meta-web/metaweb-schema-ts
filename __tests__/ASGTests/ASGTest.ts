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
import { ASG_TYPE } from "../../src/ASG/ASGNodeTypes";
import { IASGDocument } from "../../src/ASG/IASGDocument";
import { IParseFunction } from "../../src/Parser/Grammar/GrammarUtil";

import {
	ParseNamespaceDeclaration,
	ParseDocument,
	ParseTypeDeclaration,
	ParseTypeReference,
	ParseTypeStruct,
	ParseTypeExpression,
	ParseSchemaParamDeclaration,
	ParseLetStatement,
	ParseActionStatement,
	ParseReturnStatement,
	ParseSchemaStatement,
	ParseSchemaDeclaration,
	ParseActionRef,
	ParseRefVariable,
	ParseRefOrCall,
	ParseAttribute,
	ParseCallArguments,
	ParseActionInvokeStatement,
	ParseActionSetStatement,
	ParseScalarString,
	ParseExpressionList,
	ParseExpressionStruct
} from "../../src/Parser/Grammar/Grammar";

import {
	ASGCreateDocument,
	ASGCreateNamespace,
	ASGCreateDeclarationType,
	ASGCreateRefType,
	ASGCreateTypeStruct,
	ASGCreateTypeExpressionNode,
	ASGCreateDeclarationSchemaParam,
	ASGCreateDeclarationVariable,
	ASGCreateDeclarationAction,
	ASGCreateDeclarationReturn,
	ASGCreateDeclarationSchema,
	ASGCreateRefAction,
	ASGCreateRefVariable,
	ASGCreateRefParameter,
	ASGCreateRefProperty,
	ASGCreateRefSchema,
	ASGCreateCallArgument,
	ASGCreateOpInvoke,
	ASGCreateOpSet,
	ASGCreateValueScalar,
	ASGCreateValueList,
	ASGCreateValueStruct
} from "../../src/Analyzer/ASGFactories";
import { Analyzer } from "../../src/Analyzer/Analyzer";
import { IASGDeclarationReturn } from "../../src/ASG/IASGDeclarationReturn";
import { DOC_ERROR_SEVERITY } from "../../src";
import { ERROR_CODE } from "../../src/Shared/ErrorCodes";
import { IASTSchemaRefSchema, AST_NODE_TYPES } from "../../src/AST";

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

	beforeEach(() => {
		Analyzer.clear();
		Analyzer.internal_SetCurrentDocumentUri("test");
	});

	afterEach(() => {
		Analyzer.internal_SetCurrentDocumentUri(null);
	});

	it("Should create document", () => {

		const ast = parse(ParseDocument, ``);
		const asg = ASGCreateDocument("doc:doc", ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DOCUMENT,
			parent: null,
			documentUri: "doc:doc",
			namespaces: [],
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
				id: { start: { line: 1, col: 1 }, end: { line: 1, col: 2 } }
			},
			namespaces: [
				{
					node: ASG_TYPE.NAMESPACE,
					id: "B",
					refs: [],
					types: {},
					schemas: {},
					translations: {},
					parseInfo: {
						id: { start: { line: 1, col: 3 }, end: { line: 1, col: 4 } }
					},
					namespaces: [
						{
							node: ASG_TYPE.NAMESPACE,
							id: "C",
							refs: [],
							types: {},
							schemas: {},
							translations: {},
							parseInfo: {
								id: { start: { line: 2, col: 14 }, end: { line: 2, col: 15 } }
							},
							namespaces: [
								{
									node: ASG_TYPE.NAMESPACE,
									id: "D",
									refs: [],
									types: {},
									schemas: {},
									translations: {},
									namespaces: [],
									parseInfo: {
										id: { start: { line: 2, col: 16 }, end: { line: 2, col: 17 } }
									}
								}
							]
						},
						{
							node: ASG_TYPE.NAMESPACE,
							id: "C",
							refs: [],
							types: {},
							schemas: {},
							translations: {},
							parseInfo: {
								id: { start: { line: 3, col: 14 }, end: { line: 3, col: 15 } }
							},
							namespaces: [
								{
									node: ASG_TYPE.NAMESPACE,
									id: "D",
									refs: [],
									types: {},
									schemas: {},
									translations: {},
									namespaces: [],
									parseInfo: {
										id: { start: { line: 3, col: 16 }, end: { line: 3, col: 17 } }
									},
								}
							]
						}
					]
				}
			]
		});
	});

	it("Should create type reference", () => {

		const ast = parse(ParseTypeReference, `NS.List<String>`);
		const asg = ASGCreateRefType(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_TYPE,
			typeName: "List",
			refs: [],
			namespaceDef: [ "NS" ],
			namespaceRef: null,
			params: [{
				node: ASG_TYPE.REF_TYPE,
				typeName: "String",
				refs: [],
				namespaceDef: [],
				namespaceRef: null,
				params: [],
				typeDesc: null,
				parseInfo: {
					typeName: { start: { line: 1, col: 9 }, end: { line: 1, col: 15 } },
					namespace: []
				}
			}],
			typeDesc: null,
			parseInfo: {
				typeName: { start: { line: 1, col: 4 }, end: { line: 1, col: 8 } },
				namespace: [
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
			refs: [],
			props: {
				prop1: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "String",
				},
				prop2: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "Number",
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
			refs: [],
			types: [{
				node: ASG_TYPE.REF_TYPE,
				typeName: "A"
			}, {
				node: ASG_TYPE.REF_TYPE,
				typeName: "B"
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
			refs: [],
			types: [{
				node: ASG_TYPE.REF_TYPE,
				typeName: "A"
			}, {
				node: ASG_TYPE.REF_TYPE,
				typeName: "B"
			}],
			typeDesc: null
		});

	});

	it("Should create type declaration", () => {

		const ast = parse(ParseTypeDeclaration, `MyType<A, B extends C> = Map<A,B>;`);
		const asg = ASGCreateDeclarationType(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_TYPE,
			id: "MyType",
			refs: [],
			generics: [{
				node: ASG_TYPE.DL_TYPE_PARAM,
				id: "A",
				extendsTypeDef: null,
				defaultTypeDef: null,
				parseInfo: {
					id: { start: { line: 1, col: 8 }, end: { line: 1, col: 9 } }
				}
			}, {
				node: ASG_TYPE.DL_TYPE_PARAM,
				id: "B",
				extendsTypeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "C",
					refs: [],
					namespaceDef: [],
					namespaceRef: null,
					params: [],
					typeDesc: null,
					parseInfo: {
						typeName: { start: { line: 1, col: 21 }, end: { line: 1, col: 22 } },
						namespace: []
					}
				},
				defaultTypeDef: null,
				parseInfo: {
					id: { start: { line: 1, col: 11 }, end: { line: 1, col: 12 } }
				}
			}],
			typeDef: {
				node: ASG_TYPE.REF_TYPE,
				typeName: "Map",
				refs: [],
				namespaceDef: [],
				namespaceRef: null,
				params: [{
					node: ASG_TYPE.REF_TYPE,
					typeName: "A",
					refs: [],
					namespaceDef: [],
					namespaceRef: null,
					params: [],
					typeDesc: null,
					parseInfo: {
						typeName: { start: { line: 1, col: 30 }, end: { line: 1, col: 31 } },
						namespace: []
					}
				}, {
					node: ASG_TYPE.REF_TYPE,
					typeName: "B",
					refs: [],
					namespaceDef: [],
					namespaceRef: null,
					params: [],
					typeDesc: null,
					parseInfo: {
						typeName: { start: { line: 1, col: 32 }, end: { line: 1, col: 33 } },
						namespace: []
					}
				}],
				typeDesc: null,
				parseInfo: {
					typeName: { start: { line: 1, col: 26 }, end: { line: 1, col: 29 } },
					namespace: []
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

	it("Should create schema parameter declaration", () => {

		const ast = parse(ParseSchemaParamDeclaration, `(
			param1: String,
			param2: Number,
			*param3: Array
		)`);

		const asg = {};

		for (const k in ast) {
			asg[k] = ASGCreateDeclarationSchemaParam(null, ast[k]);
		}

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			param1: {
				node: ASG_TYPE.DL_SCHEMA_PARAM,
				id: "param1",
				refs: [],
				typeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "String"
				},
				defaultValue: null,
				rest: false,
				parseInfo: {
					id: { start: { line: 2, col: 4 }, end: { line: 2, col: 10 } }
				}
			},
			param2: {
				node: ASG_TYPE.DL_SCHEMA_PARAM,
				id: "param2",
				refs: [],
				typeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "Number"
				},
				defaultValue: null,
				rest: false,
				parseInfo: {
					id: { start: { line: 3, col: 4 }, end: { line: 3, col: 10 } }
				}
			},
			param3: {
				node: ASG_TYPE.DL_SCHEMA_PARAM,
				id: "param3",
				refs: [],
				typeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "Array"
				},
				defaultValue: null,
				rest: true,
				parseInfo: {
					id: { start: { line: 4, col: 5 }, end: { line: 4, col: 11 } }
				}
			}
		});

	});

	it("Should create variable declaration", () => {

		const ast = parse(ParseLetStatement, `let varName: String = "hello";`);

		const asg = ASGCreateDeclarationVariable(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_VARIABLE,
			id: "varName",
			refs: [],
			typeDef: {
				node: ASG_TYPE.REF_TYPE,
				typeName: "String"
			},
			value: {},
			statefull: false,
			propagated: false,
			parseInfo: {
				id: { start: { line: 1, col: 5 }, end: { line: 1, col: 12 } }
			}
		});

	});

	it("Should create statefull variable declaration", () => {

		const ast = parse(ParseLetStatement, `let state varName: String = "hello";`);

		const asg = ASGCreateDeclarationVariable(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_VARIABLE,
			id: "varName",
			refs: [],
			typeDef: {
				node: ASG_TYPE.REF_TYPE,
				typeName: "String"
			},
			value: {},
			statefull: true,
			propagated: false,
			parseInfo: {
				id: { start: { line: 1, col: 11 }, end: { line: 1, col: 18 } }
			}
		});

	});

	it("Should create propagated variable declaration", () => {

		const ast = parse(ParseLetStatement, `let propagate varName: String = "hello";`);

		const asg = ASGCreateDeclarationVariable(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_VARIABLE,
			id: "varName",
			refs: [],
			typeDef: {
				node: ASG_TYPE.REF_TYPE,
				typeName: "String"
			},
			value: {},
			statefull: false,
			propagated: true,
			parseInfo: {
				id: { start: { line: 1, col: 15 }, end: { line: 1, col: 22 } }
			}
		});

	});

	it("Should create action declaration", () => {

		const ast = parse(ParseActionStatement, `action MyAction(
			param1: String,
			param2: Number
		) {}`);

		const asg = ASGCreateDeclarationAction(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_ACTION,
			id: "MyAction",
			refs: [],
			params: {
				param1: {
					node: ASG_TYPE.DL_SCHEMA_PARAM,
					id: "param1"
				},
				param2: {
					node: ASG_TYPE.DL_SCHEMA_PARAM,
					id: "param2"
				}
			},
			body: [],
			override: false,
			parseInfo: {
				id: { start: { line: 1, col: 8 }, end: { line: 1, col: 16 } }
			}
		});

	});

	it("Should create overriden action declaration", () => {

		const ast = parse(ParseActionStatement, `override action MyAction {}`);

		const asg = ASGCreateDeclarationAction(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_ACTION,
			id: "MyAction",
			refs: [],
			params: {},
			body: [],
			override: true,
			parseInfo: {
				id: { start: { line: 1, col: 17 }, end: { line: 1, col: 25 } }
			}
		});

	});

	it("Should create advanced action declaration", () => {

		const ast = parse(ParseActionStatement, `action MyAction(
			param1: String,
			param2: Number
		) {
			let myVar = 42;
			set someVar = true;
			invoke someVar#someAction(param1: true, param2);
		}`);

		const asg = ASGCreateDeclarationAction(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_ACTION,
			id: "MyAction",
			refs: [],
			params: {
				param1: {
					node: ASG_TYPE.DL_SCHEMA_PARAM,
					id: "param1"
				},
				param2: {
					node: ASG_TYPE.DL_SCHEMA_PARAM,
					id: "param2"
				}
			},
			body: [{
				node: ASG_TYPE.DL_VARIABLE,
				id: "myVar"
			}, {
				node: ASG_TYPE.OP_SET,
				target: {
					node: ASG_TYPE.REF_VARIABLE,
					varName: "someVar"
				}
			}, {
				node: ASG_TYPE.OP_INVOKE,
				action: {
					node: ASG_TYPE.REF_ACTION,
					actionName: "someAction"
				}
			}],
			override: false,
			parseInfo: {
				id: { start: { line: 1, col: 8 }, end: { line: 1, col: 16 } }
			}
		});

	});

	it("Should create schema return declaration", () => {

		const ast = parse(ParseReturnStatement, `return true;`);

		const asg = ASGCreateDeclarationReturn(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_RETURN,
			refs: [],
			value: {
				node: ASG_TYPE.VAL_SCALAR,
				typeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "Boolean"
				},
				value: true
			},
			parseInfo: {
				keyword: { start: { line: 1, col: 1 }, end: { line: 1, col: 7 } }
			}
		});

	});

	it("Should create schema declaration", () => {

		const ast = parse(ParseSchemaDeclaration, `MySchema <A, B extends C> (
			param1: String,
			param2: Number
		) {
			let myVar = 42;
			action myAction {}
			override action myOverridenAction {}
			return myVar;
		}`);

		const asg = ASGCreateDeclarationSchema(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.DL_SCHEMA,
			id: "MySchema",
			refs: [],
			generics: [{
				node: ASG_TYPE.DL_TYPE_PARAM,
				id: "A"
			}, {
				node: ASG_TYPE.DL_TYPE_PARAM,
				id: "B",
				extendsTypeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "C"
				}
			}],
			params: {
				param1: {
					node: ASG_TYPE.DL_SCHEMA_PARAM,
					id: "param1"
				},
				param2: {
					node: ASG_TYPE.DL_SCHEMA_PARAM,
					id: "param2"
				}
			},
			actions: {
				myAction: {
					node: ASG_TYPE.DL_ACTION,
					id: "myAction",
					override: false
				},
				myOverridenAction: {
					node: ASG_TYPE.DL_ACTION,
					id: "myOverridenAction",
					override: true
				}
			},
			variables: {
				myVar: {
					node: ASG_TYPE.DL_VARIABLE,
					id: "myVar"
				}
			},
			return: {
				node: ASG_TYPE.DL_RETURN
			},
			parseInfo: {
				id: { start: { line: 1, col: 1 }, end: { line: 1, col: 9 } }
			}
		});

	});

	it("Should report error when duplicate schema variable identifier", () => {

		const ast = parse(ParseSchemaDeclaration, `MySchema () {
			let myVar = 42;
			let myVar = 42;
		}`);

		ASGCreateDeclarationSchema(null, ast);
		const errors = Analyzer.getCurrentDocumentErrors();

		// console.dir(errors, dirOpts);

		expect(errors).to.containSubset([{
			name: ERROR_CODE.DUPLICATE_IDENTIFIER,
			severity: DOC_ERROR_SEVERITY.ERROR,
			range: { start: { line: 3, col: 8 }, end: { line: 3, col: 13 } }
		}]);

	});

	it("Should report error when duplicate schema action identifier", () => {

		const ast = parse(ParseSchemaDeclaration, `MySchema () {
			action myAction {}
			action myAction {}
		}`);

		ASGCreateDeclarationSchema(null, ast);
		const errors = Analyzer.getCurrentDocumentErrors();

		// console.dir(errors, dirOpts);

		expect(errors).to.containSubset([{
			name: ERROR_CODE.DUPLICATE_IDENTIFIER,
			severity: DOC_ERROR_SEVERITY.ERROR,
			range: { start: { line: 3, col: 11 }, end: { line: 3, col: 19 } }
		}]);

	});

	it("Should report error when duplicate schema return statement", () => {

		const ast = parse(ParseSchemaDeclaration, `MySchema () {
			return true;
			return false;
		}`);

		ASGCreateDeclarationSchema(null, ast);
		const errors = Analyzer.getCurrentDocumentErrors();

		// console.dir(errors, dirOpts);

		expect(errors).to.containSubset([{
			name: ERROR_CODE.DUPLICATE_RETURN,
			severity: DOC_ERROR_SEVERITY.ERROR,
			range: { start: { line: 3, col: 4 }, end: { line: 3, col: 10 } },
		}]);

	});

	it("Should create action reference", () => {

		const ast = parse(ParseActionRef, `myAction`)(null);
		const asg = ASGCreateRefAction(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_ACTION,
			refs: [],
			actionName: "myAction",
			target: null,
			parseInfo: {
				actionName: { start: { line: 1, col: 1 }, end: { line: 1, col: 9 } }
			}
		});

	});

	it("Should create variable reference", () => {

		const ast = parse(ParseRefVariable, `myVar`);
		const asg = ASGCreateRefVariable(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_VARIABLE,
			refs: [],
			varName: "myVar",
			parseInfo: {
				varName: { start: { line: 1, col: 1 }, end: { line: 1, col: 6 } }
			}
		});

	});

	it("Should create parameter reference", () => {

		const ast = parse(ParseAttribute, `@myParam`);
		const asg = ASGCreateRefParameter(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_PARAM,
			refs: [],
			paramName: "myParam",
			parseInfo: {
				paramName: { start: { line: 1, col: 2 }, end: { line: 1, col: 9 } }
			}
		});

	});

	it("Should create property using dot notation reference", () => {

		const ast = parse(ParseRefVariable, `myVar.myProp`);
		const asg = ASGCreateRefProperty(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_PROPERTY,
			refs: [],
			value: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "myVar"
			},
			index: {
				node: ASG_TYPE.VAL_SCALAR,
				typeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "String"
				},
				value: "myProp"
			}
		});

	});

	it("Should create property using bracket notation reference", () => {

		const ast = parse(ParseRefVariable, `myVar[myProp]`);
		const asg = ASGCreateRefProperty(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_PROPERTY,
			refs: [],
			value: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "myVar"
			},
			index: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "myProp"
			}
		});

	});

	it("Should create schema reference", () => {

		const ast : IASTSchemaRefSchema = {
			n: AST_NODE_TYPES.REF_SCHEMA,
			ns: ["Name", "Space"],
			r: "MySchema",
		};

		const asg = ASGCreateRefSchema(null, ast);

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.REF_SCHEMA,
			refs: [],
			namespaceDef: ["Name", "Space"],
			schemaName: "MySchema"
		});

	});

	it("Should create call arguments", () => {

		const ast = parse(ParseCallArguments, `(arg1: var1, var2, ~var3)`);
		const asg = ast.map((_ast) => ASGCreateCallArgument(null, _ast));

		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset([{
			node: ASG_TYPE.CALL_ARGUMENT,
			refs: [],
			id: "arg1",
			value: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "var1"
			},
			unpack: false,
			parseInfo: {
				id: { start: { line: 1, col: 2 }, end: { line: 1, col: 6 } },
				range: { start: { line: 1, col: 2 }, end: { line: 1, col: 12 } }
			}
		}, {
			node: ASG_TYPE.CALL_ARGUMENT,
			refs: [],
			id: null,
			value: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "var2"
			},
			unpack: false,
			parseInfo: {
				id: null,
				range: { start: { line: 1, col: 14 }, end: { line: 1, col: 18 } }
			}
		}, {
			node: ASG_TYPE.CALL_ARGUMENT,
			refs: [],
			id: null,
			value: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "var3"
			},
			unpack: true,
			parseInfo: {
				id: null,
				range: { start: { line: 1, col: 20 }, end: { line: 1, col: 25 } }
			}
		}]);

	});

	it("Should create invoke operation", () => {

		const ast = parse(ParseActionInvokeStatement, `invoke myVar#action(arg1: var1);`);
		const asg = ASGCreateOpInvoke(null, ast);

		// console.dir(ast, dirOpts);
		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.OP_INVOKE,
			refs: [],
			action: {
				node: ASG_TYPE.REF_ACTION,
				target: {
					node: ASG_TYPE.REF_VARIABLE,
					varName: "myVar"
				},
				actionName: "action"
			},
			args: [{
				node: ASG_TYPE.CALL_ARGUMENT,
				id: "arg1"
			}],
			parseInfo: {
				range: { start: { line: 1, col: 1 }, end: { line: 1, col: 33 } }
			}
		});

	});

	it("Should create set operation", () => {

		const ast = parse(ParseActionSetStatement, `set myVar = true;`);
		const asg = ASGCreateOpSet(null, ast);

		// console.dir(ast, dirOpts);
		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.OP_SET,
			refs: [],
			target: {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "myVar",
				parseInfo: {
					varName: { start: { line: 1, col: 5 }, end: { line: 1, col: 10 } }
				}
			},
			typeDesc: null,
			value: {
				node: ASG_TYPE.VAL_SCALAR,
				typeDef: {
					node: ASG_TYPE.REF_TYPE,
					typeName: "Boolean"
				},
				value: true
			},
			parseInfo: {
				range: { start: { line: 1, col: 1 }, end: { line: 1, col: 18 } }
			}
		});

	});

	it("Should create scalar value", () => {

		const ast = parse(ParseScalarString, `"hello"`);
		const asg = ASGCreateValueScalar(null, ast);

		// console.dir(ast, dirOpts);
		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.VAL_SCALAR,
			refs: [],
			typeDef: {
				node: ASG_TYPE.REF_TYPE,
				typeName: "String"
			},
			typeDesc: null,
			value: "hello",
			parseInfo: {
				range: { start: { line: 1, col: 1 }, end: { line: 1, col: 8 } }
			}
		});

	});

	it("Should create list value", () => {

		const ast = parse(ParseExpressionList, `[
			"string",
			myVar
		]`);
		const asg = ASGCreateValueList(null, ast);

		// console.dir(ast, dirOpts);
		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.VAL_LIST,
			refs: [],
			typeDesc: null,
			value: [{
				node: ASG_TYPE.VAL_SCALAR,
				value: "string",
				parseInfo: {
					range: { start: { line: 2, col: 4 }, end: { line: 2, col: 12 } }
				}
			}, {
				node: ASG_TYPE.REF_VARIABLE,
				varName: "myVar",
				parseInfo: {
					varName: { start: { line: 3, col: 4 }, end: { line: 3, col: 9 } }
				}
			}],
			parseInfo: {
				range: { start: { line: 1, col: 1 }, end: { line: 4, col: 4 } }
			}
		});

	});

	it("Should create struct value", () => {

		const ast = parse(ParseExpressionStruct, `{
			prop1: "string",
			prop2: 42,
			prop3: myVar
		}`);

		const asg = ASGCreateValueStruct(null, ast);

		// console.dir(ast, dirOpts);
		// console.dir(asg, dirOpts);

		expect(asg).to.containSubset({
			node: ASG_TYPE.VAL_STRUCT,
			refs: [],
			typeDesc: null,
			props: {
				prop1: {
					node: ASG_TYPE.VAL_SCALAR,
					value: "string",
					parseInfo: {
						range: { start: { line: 2, col: 11 }, end: { line: 2, col: 19 } }
					}
				},
				prop2: {
					node: ASG_TYPE.VAL_SCALAR,
					value: 42,
					parseInfo: {
						range: { start: { line: 3, col: 11 }, end: { line: 3, col: 13 } }
					}
				},
				prop3: {
					node: ASG_TYPE.REF_VARIABLE,
					varName: "myVar",
					parseInfo: {
						varName: { start: { line: 4, col: 11 }, end: { line: 4, col: 16 } }
					}
				}
			},
			parseInfo: {
				range: { start: { line: 1, col: 1 }, end: { line: 5, col: 4 } },
				props: {
					prop1: { start: { line: 2, col: 4 }, end: { line: 2, col: 19 } },
					prop2: { start: { line: 3, col: 4 }, end: { line: 3, col: 13 } },
					prop3: { start: { line: 4, col: 4 }, end: { line: 4, col: 16 } }
				}
			}
		});

	});

});