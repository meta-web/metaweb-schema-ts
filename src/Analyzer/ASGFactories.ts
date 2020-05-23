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

import {
	AST_NODE_TYPES,
	IASTSchemaDocument,
	IASTSchemaNamespace,
	IASTSchemaType,
	IASTSchemaRefType,
	TASTSchemaTypeExpression,
	IASTSchemaTypeStruct,
	IASTSchemaTypeOneOf,
	IASTSchemaTypeAllOf,
	IASTSchemaGeneric,
	IASTSchemaParam,
	TASTSchemaExpression,
	IASTSchemaVariable,
	IASTSchemaAction,
	IASTSchema,
	IASTSchemaReturn,
	IASTSchemaRefAction,
	IASTSchemaRefVariable,
	IASTSchemaRefParam,
	IASTSchemaRefProperty,
	IASTSchemaRefSchema,
	IASTSchemaCallArgument,
	IASTSchemaInvoke,
	IASTSchemaSet,
	IASTSchemaScalar,
	IASTSchemaValueList,
	IASTSchemaValueStruct
} from "../AST";
import { IASGDocument } from "../ASG/IASGDocument";
import { ASG_TYPE } from "../ASG/ASGNodeTypes";
import { IASGNode } from "../ASG/IASGNode";
import { IASGNamespace } from "../ASG/IASGNamespace";
import { IASGDeclarationType } from "../ASG/IASGDeclarationType";
import { IASGRefType } from "../ASG/IASGRefType";
import { TASGTypeExpressionNode } from "../ASG/TASGTypeExpression";
import { IASGTypeStruct } from "../ASG/IASGTypeStruct";
import { IASGTypeOneOf } from "../ASG/IASGTypeOneOf";
import { IASGTypeAllOf } from "../ASG/IASGTypeAllOf";
import { IASGDeclarationTypeParam } from "../ASG/IASGDeclarationTypeParam";
import { IASGDeclarationSchemaParam } from "../ASG/IASGDeclarationSchemaParam";
import { TASGValueExpressionNode } from "../ASG/TASGValueExpression";
import { IASGDeclarationVariable } from "../ASG/IASGDeclarationVariable";
import { IASGDeclarationSchema } from "../ASG/IASGDeclarationSchema";
import { IASGDeclarationAction } from "../ASG/IASGDeclarationAction";
import { Analyzer } from "./Analyzer";
import { DOC_ERROR_SEVERITY } from "../Shared/IDocumentError";
import { IASGDeclarationReturn } from "../ASG/IASGDeclarationReturn";
import { ERROR_CODE } from "../Shared/ErrorCodes";
import { IASGRefAction } from "../ASG/IASGRefAction";
import { IASGRefVariable } from "../ASG/IASGRefVariable";
import { IASGRefParameter } from "../ASG/IASGRefParameter";
import { IASGRefProperty } from "../ASG/IASGRefProperty";
import { IASGRefSchema } from "../ASG/IASGRefSchema";
import { IASGCallArgument } from "../ASG/IASGCallArgument";
import { IASGOpInvoke } from "../ASG/IASGOpInvoke";
import { IASGOpSet } from "../ASG/IASGOpSet";
import { IASGValueScalar } from "../ASG/IASGValueScalar";
import { IASGValueList } from "../ASG/IASGValueList";
import { IASGValueStruct } from "../ASG/IASGValueStruct";

/**
 * Creates ASG Document
 *
 * @param documentUri Document URI
 * @param ast AST node
 */
export function ASGCreateDocument(documentUri: string, ast: IASTSchemaDocument) : IASGDocument {

	const node : IASGDocument = {
		node: ASG_TYPE.DOCUMENT,
		parent: null,
		documentUri: documentUri,
		refs: [],
		imports: [],
		namespaces: []
	}

	for (let i = 0; i < ast.ns.length; i++) {
		const nsNode = ASGCreateNamespace(node, ast.ns[i]);
		node.namespaces.push(nsNode);
	}

	return node;

}

/**
 * Creates ASG Namespace
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateNamespace(
	parent: IASGNode<ASG_TYPE.DOCUMENT|ASG_TYPE.NAMESPACE>,
	ast: IASTSchemaNamespace
) : IASGNamespace {

	if (ast.id.length < 1) {
		throw new Error("Invalid AST node, expect ID length > 0");
	}

	const id = ast.id.slice();
	const token = ast.parseInfo ? ast.parseInfo.id.slice() : null;

	// Create namespace(s)
	const node : IASGNamespace = {
		node: ASG_TYPE.NAMESPACE,
		parent: parent,
		id: id.shift(),
		refs: [],
		namespaces: [],
		uses: [],
		types: {},
		schemas: {},
		translations: {},
		parseInfo: {
			id: token ? token.shift() : null
		}
	};

	let targetNode = node;
	let currId;

	// tslint:disable-next-line: no-conditional-assignment
	while((currId = id.shift())) {

		const nestedNode : IASGNamespace = {
			node: ASG_TYPE.NAMESPACE,
			parent: parent,
			id: currId,
			refs: [],
			namespaces: [],
			uses: [],
			types: {},
			schemas: {},
			translations: {},
			parseInfo: {
				id: token ? token.shift() : null
			}
		};

		targetNode.namespaces.push(nestedNode);
		targetNode = nestedNode;

	}

	// Add child namespaces
	for (let i = 0; i < ast.ns.length; i++) {
		const nestedNs = ASGCreateNamespace(targetNode, ast.ns[i]);
		targetNode.namespaces.push(nestedNs);
	}

	// Add types
	for (let i = 0; i < ast.t.length; i++) {
		const typeNode = ASGCreateDeclarationType(targetNode, ast.t[i]);

		if (!targetNode.types[typeNode.id]) {
			targetNode.types[typeNode.id] = [];
		}

		targetNode.types[typeNode.id].push(typeNode);
	}

	// Add schemas
	for (let i = 0; i < ast.s.length; i++) {
		const schemaNode = ASGCreateDeclarationSchema(targetNode, ast.s[i]);

		if (!targetNode.schemas[schemaNode.id]) {
			targetNode.schemas[schemaNode.id] = [];
		}

		targetNode.schemas[schemaNode.id].push(schemaNode);
	}

	return node;

}

/**
 * Merges one namespace into another
 * Modifies original target.
 *
 * @param target Target to merge into
 * @param source Source to merge from
 */
/*
export function ASGMergeNamespace(target: IASGNamespace, source: IASGNamespace) : IASGNamespace {

	if (!target) {
		return source;
	}

	// Merge namespaces
	for (const k in source.namespaces) {
		target.namespaces[k] = ASGMergeNamespace(target.namespaces[k], source.namespaces[k]);
	}

	// Merge types
	for (const k in source.types) {
		if (!target.types[k]) {
			target.types[k] = [];
		}

		for (let i = 0; i < source.types[k].length; i++) {
			target.types[k].push(source.types[k][i]);
		}
	}

	// Merge schemas
	for (const k in source.schemas) {
		if (!target.schemas[k]) {
			target.schemas[k] = [];
		}

		for (let i = 0; i < source.schemas[k].length; i++) {
			target.schemas[k].push(source.schemas[k][i]);
		}
	}

	// Merge translations
	for (const k in source.translations) {
		if (!target.translations[k]) {
			target.translations[k] = [];
		}

		for (let i = 0; i < source.translations[k].length; i++) {
			target.translations[k].push(source.translations[k][i]);
		}
	}

	// Merge parse info
	if (source.parseInfo.id) {
		for (let i = 0; i < source.parseInfo.id.length; i++) {
			target.parseInfo.id.push(source.parseInfo.id[i]);
		}
	}

	return target;

}
*/

/**
 * Creates ASG Type declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationType(
	parent: IASGNode<ASG_TYPE.NAMESPACE>,
	ast: IASTSchemaType
) : IASGDeclarationType {

	const node : IASGDeclarationType = {
		node: ASG_TYPE.DL_TYPE,
		parent: parent,
		id: ast.id,
		refs: [],
		generics: [],
		typeDef: null,
		typeDesc: null,
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	if (ast.t) {
		node.typeDef = ASGCreateTypeExpressionNode(node, ast.t);
	}

	for (let i = 0; i < ast.g.length; i++) {
		node.generics.push(ASGCreateDeclarationTypeParam(node, ast.g[i]));
	}

	return node;

}

/**
 * Creates ASG Type parameter declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationTypeParam(
	parent: IASGDeclarationType|IASGDeclarationSchema,
	ast: IASTSchemaGeneric
) : IASGDeclarationTypeParam {

	const node : IASGDeclarationTypeParam = {
		node: ASG_TYPE.DL_TYPE_PARAM,
		parent: parent,
		id: ast.id,
		refs: [],
		extendsTypeDef: null,
		defaultTypeDef: null,
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	if (ast.ex) {
		node.extendsTypeDef = ASGCreateTypeExpressionNode(node, ast.ex);
	}

	if (ast.df) {
		node.defaultTypeDef = ASGCreateTypeExpressionNode(node, ast.df);
	}

	return node;

}

/**
 * Creates proper type expression node
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateTypeExpressionNode(
	parent: IASGNode,
	ast: TASTSchemaTypeExpression
) : TASGTypeExpressionNode {

	switch(ast.n) {
		case AST_NODE_TYPES.REF_TYPE:
			return ASGCreateRefType(parent, ast);
		case AST_NODE_TYPES.TYPE_STRUCT:
			return ASGCreateTypeStruct(parent, ast);
		case AST_NODE_TYPES.TYPE_ONEOF:
			return ASGCreateTypeOneOf(parent, ast);
		case AST_NODE_TYPES.TYPE_ALLOF:
			return ASGCreateTypeAllOf(parent, ast);
		default:
			throw new Error(`Unknown type expression node.`);
	}

}

/**
 * Creates ASG Type reference
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateRefType(
	parent: IASGNode,
	ast: IASTSchemaRefType
) : IASGRefType {

	const node : IASGRefType = {
		node: ASG_TYPE.REF_TYPE,
		parent: parent,
		typeName: ast.r,
		refs: [],
		namespaceDef: ast.ns,
		namespaceRef: null,
		params: [],
		typeDesc: null,
		parseInfo: {
			typeName: ast.parseInfo.r,
			namespace: ast.parseInfo.ns
		}
	};

	// Add params
	for (let i = 0; i < ast.p.length; i++) {
		node.params.push( ASGCreateTypeExpressionNode(node, ast.p[i]) );
	}

	return node;

}

/**
 * Creates ASG Type struct
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateTypeStruct(
	parent: IASGNode,
	ast: IASTSchemaTypeStruct
) : IASGTypeStruct {

	const node : IASGTypeStruct = {
		node: ASG_TYPE.TYPE_STRUCT,
		parent: parent,
		refs: [],
		props: {},
		typeDesc: null,
		parseInfo: {
			props: {}
		}
	};

	// Add properties
	for (const k in ast.p) {
		node.props[k] = ASGCreateTypeExpressionNode(node, ast.p[k]);
		node.parseInfo.props[k] = ast.parseInfo.p[k];
	}

	return node;

}

/**
 * Creates ASG Type one of
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateTypeOneOf(
	parent: IASGNode,
	ast: IASTSchemaTypeOneOf
) : IASGTypeOneOf {

	const node : IASGTypeOneOf = {
		node: ASG_TYPE.TYPE_ONEOF,
		parent: parent,
		refs: [],
		types: [],
		typeDesc: null,
	};

	// Add types
	for (let i = 0; i < ast.t.length; i++) {
		node.types.push(ASGCreateTypeExpressionNode(node, ast.t[i]));
	}

	return node;

}

/**
 * Creates ASG Type all of
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateTypeAllOf(
	parent: IASGNode,
	ast: IASTSchemaTypeAllOf
) : IASGTypeAllOf {

	const node : IASGTypeAllOf = {
		node: ASG_TYPE.TYPE_ALLOF,
		parent: parent,
		refs: [],
		types: [],
		typeDesc: null,
	};

	// Add types
	for (let i = 0; i < ast.t.length; i++) {
		node.types.push(ASGCreateTypeExpressionNode(node, ast.t[i]));
	}

	return node;

}

/**
 * Creates ASG variable declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationSchema(
	parent: IASGNamespace,
	ast: IASTSchema
) : IASGDeclarationSchema {

	const node : IASGDeclarationSchema = {
		node: ASG_TYPE.DL_SCHEMA,
		parent: parent,
		id: ast.id,
		refs: [],
		generics: [],
		params: {},
		actions: {},
		variables: {},
		return: null,
		typeDesc: null,
		typeSchemaDesc: null,
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	// Assign generics
	for (let i = 0; i < ast.g.length; i++) {
		node.generics.push(ASGCreateDeclarationTypeParam(node, ast.g[i]));
	}

	// Assign params
	for (const k in ast.p) {
		node.params[k] = ASGCreateDeclarationSchemaParam(node, ast.p[k]);
	}

	// Parse body
	for (let i = 0; i < ast.b.length; i++) {

		const bodyAst = ast.b[i];

		switch(bodyAst.n) {

			/* VARIABLE */
			case AST_NODE_TYPES.VARIABLE:
				const varNode = ASGCreateDeclarationVariable(node, bodyAst as IASTSchemaVariable);

				if (node.variables[varNode.id]) {
					Analyzer.addError(
						DOC_ERROR_SEVERITY.ERROR,
						ERROR_CODE.DUPLICATE_IDENTIFIER,
						`Variable with name '${varNode.id}' is already declared.`,
						varNode.parseInfo.id,
						[{
							location: {
								uri: Analyzer.getCurrentDocumentUri(),
								range: node.variables[varNode.id].parseInfo.id
							},
							message: "Variable is already declared here."
						}]
					);

					Analyzer.addError(
						DOC_ERROR_SEVERITY.ERROR,
						ERROR_CODE.DUPLICATE_IDENTIFIER,
						`Variable cannot be re-declared elsewhere.`,
						node.variables[varNode.id].parseInfo.id,
						[{
							location: {
								uri: Analyzer.getCurrentDocumentUri(),
								range: varNode.parseInfo.id
							},
							message: "Variable is also declared here."
						}]
					);

					continue;
				}

				node.variables[varNode.id] = varNode;
				break;

			/* ACTION */
			case AST_NODE_TYPES.SCHEMA_ACTION:
				const actionNode = ASGCreateDeclarationAction(node, bodyAst as IASTSchemaAction);

				if (node.actions[actionNode.id]) {
					Analyzer.addError(
						DOC_ERROR_SEVERITY.ERROR,
						ERROR_CODE.DUPLICATE_IDENTIFIER,
						`Action with name '${actionNode.id}' is already declared.`,
						actionNode.parseInfo.id,
						[{
							location: {
								uri: Analyzer.getCurrentDocumentUri(),
								range: node.actions[actionNode.id].parseInfo.id
							},
							message: "Action is already declared here."
						}]
					);

					Analyzer.addError(
						DOC_ERROR_SEVERITY.ERROR,
						ERROR_CODE.DUPLICATE_IDENTIFIER,
						`Action with name '${actionNode.id}' cannot be re-declared elsewhere.`,
						node.actions[actionNode.id].parseInfo.id,
						[{
							location: {
								uri: Analyzer.getCurrentDocumentUri(),
								range: actionNode.parseInfo.id
							},
							message: "Action is also declared here."
						}]
					);

					continue;
				}

				node.actions[actionNode.id] = actionNode;
				break;

			/* RETURN */
			case AST_NODE_TYPES.RETURN:
				const retNode = ASGCreateDeclarationReturn(node, bodyAst as IASTSchemaReturn);

				if (node.return) {
					Analyzer.addError(
						DOC_ERROR_SEVERITY.ERROR,
						ERROR_CODE.DUPLICATE_RETURN,
						`Return value was already defined.`,
						retNode.parseInfo.keyword,
						[{
							location: {
								uri: Analyzer.getCurrentDocumentUri(),
								range: node.return.parseInfo.keyword
							},
							message: "Return value is already declared here."
						}]
					);

					Analyzer.addError(
						DOC_ERROR_SEVERITY.ERROR,
						ERROR_CODE.DUPLICATE_RETURN,
						`Return value cannot be re-declared elsewhere.`,
						node.return.parseInfo.keyword,
						[{
							location: {
								uri: Analyzer.getCurrentDocumentUri(),
								range: retNode.parseInfo.keyword
							},
							message: "Return value is also declared here."
						}]
					);

					continue;
				}

				node.return = retNode;
				break;

		}

	}

	return node;

}

/**
 * Creates ASG schema parameter declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationSchemaParam(
	parent: IASGNode,
	ast: IASTSchemaParam
) : IASGDeclarationSchemaParam {

	const node : IASGDeclarationSchemaParam = {
		node: ASG_TYPE.DL_SCHEMA_PARAM,
		parent: parent,
		id: ast.id,
		refs: [],
		typeDef: null,
		typeDesc: null,
		defaultValue: null,
		rest: ast.r,
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	if (ast.t) {
		node.typeDef = ASGCreateTypeExpressionNode(node, ast.t);
	}

	if (ast.v) {
		node.defaultValue = ASGCreateValueExpressionNode(node, ast.v);
	}

	return node;

}

/**
 * Creates ASG variable declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationVariable(
	parent: IASGNode,
	ast: IASTSchemaVariable
) : IASGDeclarationVariable {

	const node : IASGDeclarationVariable = {
		node: ASG_TYPE.DL_VARIABLE,
		parent: parent,
		id: ast.id,
		refs: [],
		typeDef: null,
		typeDesc: null,
		value: null,
		statefull: ast.st,
		propagated: ast.pr,
		watch: [], /** @todo */
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	if (ast.t) {
		node.typeDef = ASGCreateTypeExpressionNode(node, ast.t);
	}

	if (ast.v) {
		node.value = ASGCreateValueExpressionNode(node, ast.v);
	}

	return node;

}

/**
 * Creates ASG return declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationReturn(
	parent: IASGNode,
	ast: IASTSchemaReturn
) : IASGDeclarationReturn {

	const node : IASGDeclarationReturn = {
		node: ASG_TYPE.DL_RETURN,
		parent: parent,
		refs: [],
		typeDesc: null,
		value: null,
		parseInfo: {
			keyword: ast.parseInfo.keyword
		}
	};

	if (ast.v) {
		node.value = ASGCreateValueExpressionNode(node, ast.v);
	}

	return node;

}

/**
 * Creates ASG variable declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateDeclarationAction(
	parent: IASGDeclarationSchema,
	ast: IASTSchemaAction
) : IASGDeclarationAction {

	const node : IASGDeclarationAction = {
		node: ASG_TYPE.DL_ACTION,
		parent: parent,
		id: ast.id,
		refs: [],
		params: {},
		body: [],
		override: ast.o,
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	// Assign params
	for (const k in ast.p) {
		node.params[k] = ASGCreateDeclarationSchemaParam(node, ast.p[k]);
	}

	// Assign body statements
	for (let i = 0; i < ast.b.length; i++) {

		const bodyNode = ast.b[i];

		switch(bodyNode.n) {

			/* VARIABLE */
			case AST_NODE_TYPES.VARIABLE:
				node.body.push(ASGCreateDeclarationVariable(node, bodyNode as IASTSchemaVariable));
				break;

			/* SET */
			case AST_NODE_TYPES.SET:
				node.body.push(ASGCreateOpSet(node, bodyNode as IASTSchemaSet));
				break;

			/* INVOKE */
			case AST_NODE_TYPES.INVOKE:
				node.body.push(ASGCreateOpInvoke(node, bodyNode as IASTSchemaInvoke));
				break;

		}

	}

	return node;

}

/**
 * Creates ASG Variable reference
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateRefVariable(
	parent: IASGNode,
	ast: IASTSchemaRefVariable
) : IASGRefVariable {

	const node : IASGRefVariable = {
		node: ASG_TYPE.REF_VARIABLE,
		parent: parent,
		refs: [],
		varName: ast.r,
		varRef: null,
		typeDesc: null,
		parseInfo: {
			varName: ast.parseInfo.r
		}
	};

	return node;

}

/**
 * Creates ASG Parameter reference
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateRefParameter(
	parent: IASGNode,
	ast: IASTSchemaRefParam
) : IASGRefParameter {

	const node : IASGRefParameter = {
		node: ASG_TYPE.REF_PARAM,
		parent: parent,
		refs: [],
		paramName: ast.r,
		typeDesc: null,
		parseInfo: {
			paramName: ast.parseInfo.r
		}
	};

	return node;

}

/**
 * Creates ASG Property reference
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateRefProperty(
	parent: IASGNode,
	ast: IASTSchemaRefProperty
) : IASGRefProperty {

	const node : IASGRefProperty = {
		node: ASG_TYPE.REF_PROPERTY,
		parent: parent,
		refs: [],
		value: null,
		index: null,
		typeDesc: null
	};

	// Add value
	if (ast.v) {
		node.value = ASGCreateValueExpressionNode(node, ast.v);
	}

	// Add index
	if (ast.i) {
		node.index = ASGCreateValueExpressionNode(node, ast.i);
	}

	return node;

}

/**
 * Creates ASG Schema reference
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateRefSchema(
	parent: IASGNode,
	ast: IASTSchemaRefSchema
) : IASGRefSchema {

	const node : IASGRefSchema = {
		node: ASG_TYPE.REF_SCHEMA,
		parent: parent,
		schemaName: ast.r,
		refs: [],
		namespaceDef: ast.ns,
		namespaceRef: null,
		typeDesc: null,
	};

	return node;

}

/**
 * Creates ASG Action reference
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateRefAction(
	parent: IASGNode,
	ast: IASTSchemaRefAction
) : IASGRefAction {

	const node : IASGRefAction = {
		node: ASG_TYPE.REF_ACTION,
		parent: parent,
		refs: [],
		target: null,
		actionName: ast.id,
		parseInfo: {
			actionName: ast.parseInfo.id,
		}
	};

	// Add target
	if (ast.r) {
		node.target = ASGCreateValueExpressionNode(node, ast.r);
	}

	return node;

}

/**
 * Creates ASG Call argument
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateCallArgument(
	parent: IASGNode,
	ast: IASTSchemaCallArgument
) : IASGCallArgument {

	const node : IASGCallArgument = {
		node: ASG_TYPE.CALL_ARGUMENT,
		parent: parent,
		refs: [],
		id: ast.id,
		argName: null,
		value: null,
		typeDesc: null,
		unpack: ast.r,
		parseInfo: {
			id: ast.parseInfo.id,
			range: ast.parseInfo.range
		}
	};

	// Add value
	if (ast.v) {
		node.value = ASGCreateValueExpressionNode(node, ast.v);
	}

	return node;

}

/**
 * Creates ASG Invoke operation
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateOpInvoke(
	parent: IASGNode,
	ast: IASTSchemaInvoke
) : IASGOpInvoke {

	const node : IASGOpInvoke = {
		node: ASG_TYPE.OP_INVOKE,
		parent: parent,
		refs: [],
		action: null,
		args: [],
		parseInfo: {
			range: ast.parseInfo.range,
		}
	};

	// Add action
	if (ast.s) {
		node.action = ASGCreateRefAction(node, ast.s);
	}

	// Add arguments
	if (ast.a) {
		for (let i = 0; i < ast.a.length; i++) {
			node.args.push(ASGCreateCallArgument(node, ast.a[i]));
		}
	}

	return node;

}

/**
 * Creates ASG Set operation
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateOpSet(
	parent: IASGNode,
	ast: IASTSchemaSet
) : IASGOpSet {

	const node : IASGOpSet = {
		node: ASG_TYPE.OP_SET,
		parent: parent,
		refs: [],
		target: null,
		typeDesc: null,
		value: null,
		parseInfo: {
			range: ast.parseInfo.range,
		}
	};

	// Add target
	if (ast.r) {
		node.target = ASGCreateRefVariable(node, ast.r);
	}

	// Add value
	if (ast.v) {
		node.value = ASGCreateValueExpressionNode(node, ast.v);
	}

	return node;

}

/**
 * Creates ASG Scalar value node
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateValueScalar(
	parent: IASGNode,
	ast: IASTSchemaScalar
) : IASGValueScalar {

	const node : IASGValueScalar = {
		node: ASG_TYPE.VAL_SCALAR,
		parent: parent,
		refs: [],
		typeDef: null,
		typeDesc: null,
		value: ast.v,
		parseInfo: {
			range: ast.parseInfo.range,
		}
	};

	if (ast.t) {
		node.typeDef = ASGCreateTypeExpressionNode(node, ast.t);
	}

	return node;

}

/**
 * Creates ASG List value node
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateValueList(
	parent: IASGNode,
	ast: IASTSchemaValueList
) : IASGValueList {

	const node : IASGValueList = {
		node: ASG_TYPE.VAL_LIST,
		parent: parent,
		refs: [],
		typeDesc: null,
		value: [],
		parseInfo: {
			range: ast.parseInfo.range,
		}
	};

	if (ast.e) {
		for (let i = 0; i < ast.e.length; i++) {
			node.value.push( ASGCreateValueExpressionNode(node, ast.e[i]) );
		}
	}

	return node;

}

/**
 * Creates ASG Struct value node
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateValueStruct(
	parent: IASGNode,
	ast: IASTSchemaValueStruct
) : IASGValueStruct {

	const node : IASGValueStruct = {
		node: ASG_TYPE.VAL_STRUCT,
		parent: parent,
		refs: [],
		typeDesc: null,
		props: {},
		parseInfo: {
			range: ast.parseInfo.range,
			props: ast.parseInfo.p
		}
	};

	if (ast.p) {
		for (const k in ast.p) {
			node.props[k] = ASGCreateValueExpressionNode(node, ast.p[k]);
		}
	}

	return node;

}

/**
 * Creates proper value expression node
 * @todo
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateValueExpressionNode(
	parent: IASGNode,
	ast: TASTSchemaExpression
) : TASGValueExpressionNode {

	switch(ast.n) {
		case AST_NODE_TYPES.SCALAR:
			return ASGCreateValueScalar(parent, ast);

		case AST_NODE_TYPES.VALUE_LIST:
			return ASGCreateValueList(parent, ast);

		case AST_NODE_TYPES.VALUE_STRUCT:
			return ASGCreateValueStruct(parent, ast);

		case AST_NODE_TYPES.REF_ACTION:
			return ASGCreateRefAction(parent, ast);

		case AST_NODE_TYPES.REF_VARIABLE:
			return ASGCreateRefVariable(parent, ast);

		case AST_NODE_TYPES.REF_PROPERTY:
			return ASGCreateRefProperty(parent, ast);

		/*
		case AST_NODE_TYPES.REF_TRANSLATION:
			return ASGCreateRefTranslation(parent, ast);
		*/

		case AST_NODE_TYPES.REF_SCHEMA:
			return ASGCreateRefSchema(parent, ast);

		/*
		case AST_NODE_TYPES.CALL:
			return ASGCreateSchemaCall(parent, ast);
		*/

		/*
		case AST_NODE_TYPES.LAMBDA:
			return ASGCreateLambda(parent, ast);
		*/

		/*
		case AST_NODE_TYPES.CONDITION:
			return ASGCreateCondition(parent, ast);
		*/

		/*
		case AST_NODE_TYPES.CONDITION_TYPE:
			return ASGCreateConditionType(parent, ast);
		*/

		default:
			throw new Error(`Unknown value expression node.`);
	}

}