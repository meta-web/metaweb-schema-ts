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
	IASTSchemaTypeAllOf
} from "../AST";
import { IASGDocument } from "./IASGDocument";
import { ASG_TYPE } from "./ASGNodeTypes";
import { IASGNode } from "./IASGNode";
import { IASGNamespace } from "./IASGNamespace";
import { IASGDeclarationType } from "./IASGDeclarationType";
import { IASGRefType } from "./IASGRefType";
import { TASGTypeExpressionNode } from "./TASGTypeExpression";
import { IASGTypeStruct } from "./IASGTypeStruct";
import { IASGTypeOneOf } from "./IASGTypeOneOf";
import { IASGTypeAllOf } from "./IASGTypeAllOf";

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
		id: documentUri,
		documentUri: documentUri,
		refs: [],
		namespaces: {}
	}

	for (let i = 0; i < ast.ns.length; i++) {
		const nsNode = ASGCreateNamespace(node, ast.ns[i]);
		node.namespaces[nsNode.id] = ASGMergeNamespace(node.namespaces[nsNode.id], nsNode);
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
		namespaces: {},
		types: {},
		schemas: {},
		translations: {},
		parseInfo: {
			id: token ? [ token.shift() ] : []
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
			namespaces: {},
			types: {},
			schemas: {},
			translations: {},
			parseInfo: {
				id: token ? [ token.shift() ] : []
			}
		};

		targetNode.namespaces[nestedNode.id] = nestedNode;
		targetNode = nestedNode;

	}

	// Add child namespaces
	for (let i = 0; i < ast.ns.length; i++) {
		const nestedNs = ASGCreateNamespace(targetNode, ast.ns[i]);
		targetNode.namespaces[nestedNs.id] = ASGMergeNamespace(targetNode.namespaces[nestedNs.id], nestedNs);
	}

	// Add types
	for (let i = 0; i < ast.t.length; i++) {
		const typeNode = ASGCreateTypeDeclaration(targetNode, ast.t[i]);

		if (!targetNode.types[typeNode.id]) {
			targetNode.types[typeNode.id] = [];
		}

		targetNode.types[typeNode.id].push(typeNode);
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

/**
 * Creates ASG Type declaration
 *
 * @param parent Parent node
 * @param ast AST node
 */
export function ASGCreateTypeDeclaration(
	parent: IASGNode<ASG_TYPE.NAMESPACE>,
	ast: IASTSchemaType
) : IASGDeclarationType {

	const node : IASGDeclarationType = {
		node: ASG_TYPE.DL_TYPE,
		parent: parent,
		id: ast.id,
		refs: [],
		typeDef: null,
		typeDesc: null,
		parseInfo: {
			id: ast.parseInfo.id
		}
	};

	node.typeDef = ASGCreateTypeExpressionNode(node, ast.t);

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
		id: ast.r,
		refs: [],
		namespaceDef: ast.ns,
		namespaceRef: null,
		params: [],
		typeDesc: null,
		parseInfo: {
			id: ast.parseInfo.r,
			ns: ast.parseInfo.ns
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
		id: null,
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
		id: null,
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
		id: null,
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