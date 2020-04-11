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

export enum AST_NODE_TYPES {
	IMPORT = "im",
	USE = "us",
	SCHEMA = "sc",
	TYPE = "t",
	DOCUMENT = "d",
	NAMESPACE = "ns",
	TRANSLATION = "lg",
	TRANSLATION_TERM = "lt",
	TYPE_ONEOF = "tu",
	TYPE_ALLOF = "ti",
	TYPE_STRUCT = "ts",
	TYPE_LIST = "tl",
	TYPE_MAP = "tm",
	TYPE_GUARD = "sg",
	TYPE_PARAM = "tp",
	GENERIC = "gn",
	SCHEMA_PARAM = "sp",
	SCHEMA_ACTION = "ac",
	REF_PARAM = "rp",
	REF_PROPERTY = "rr",
	REF_VARIABLE = "re",
	REF_SCHEMA = "rs",
	REF_ACTION = "ra",
	REF_TYPE = "rt",
	REF_TRANSLATION = "rl",
	LAMBDA = "lb",
	CALL = "cl",
	CALL_ARGUMENT = "ca",
	CONDITION = "cn",
	CONDITION_TYPE = "ct",
	VARIABLE = "v",
	UPDATE = "u",
	INVOKE = "in",
	RETURN = "r",
	CONST = "c",
	VALUE_LIST = "vl",
	VALUE_STRUCT = "vs"
}

export const NODE_TYPE_LABELS = {
	[AST_NODE_TYPES.IMPORT]: "import",
	[AST_NODE_TYPES.USE]: "use",
	[AST_NODE_TYPES.SCHEMA]: "schema",
	[AST_NODE_TYPES.TYPE]: "type",
	[AST_NODE_TYPES.DOCUMENT]: "document",
	[AST_NODE_TYPES.NAMESPACE]: "namespace",
	[AST_NODE_TYPES.TRANSLATION]: "translation",
	[AST_NODE_TYPES.TRANSLATION_TERM]: "translation_term",
	[AST_NODE_TYPES.TYPE_ONEOF]: "type_oneof",
	[AST_NODE_TYPES.TYPE_ALLOF]: "type_allof",
	[AST_NODE_TYPES.TYPE_STRUCT]: "type_struct",
	[AST_NODE_TYPES.TYPE_LIST]: "type_list",
	[AST_NODE_TYPES.TYPE_MAP]: "type_map",
	[AST_NODE_TYPES.TYPE_GUARD]: "type_guard",
	[AST_NODE_TYPES.TYPE_PARAM]: "type_param",
	[AST_NODE_TYPES.GENERIC]: "generic",
	[AST_NODE_TYPES.SCHEMA_PARAM]: "schema_param",
	[AST_NODE_TYPES.SCHEMA_ACTION]: "action",
	[AST_NODE_TYPES.REF_PARAM]: "ref_param",
	[AST_NODE_TYPES.REF_PROPERTY]: "ref_prop",
	[AST_NODE_TYPES.REF_VARIABLE]: "ref_var",
	[AST_NODE_TYPES.REF_SCHEMA]: "ref_schema",
	[AST_NODE_TYPES.REF_ACTION]: "ref_action",
	[AST_NODE_TYPES.REF_TYPE]: "ref_type",
	[AST_NODE_TYPES.REF_TRANSLATION]: "ref_translation",
	[AST_NODE_TYPES.LAMBDA]: "lambda",
	[AST_NODE_TYPES.CALL]: "call",
	[AST_NODE_TYPES.CALL_ARGUMENT]: "call_arg",
	[AST_NODE_TYPES.CONDITION]: "cond",
	[AST_NODE_TYPES.CONDITION_TYPE]: "cond_type",
	[AST_NODE_TYPES.VARIABLE]: "var",
	[AST_NODE_TYPES.UPDATE]: "update",
	[AST_NODE_TYPES.INVOKE]: "invoke",
	[AST_NODE_TYPES.RETURN]: "return",
	[AST_NODE_TYPES.CONST]: "const",
	[AST_NODE_TYPES.VALUE_LIST]: "val_list",
	[AST_NODE_TYPES.VALUE_STRUCT]: "val_struct"
};
