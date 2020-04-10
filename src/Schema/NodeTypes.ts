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

export enum NODE_TYPES {
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
	TYPE_SCALAR = "tv",
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
	[NODE_TYPES.IMPORT]: "import",
	[NODE_TYPES.USE]: "use",
	[NODE_TYPES.SCHEMA]: "schema",
	[NODE_TYPES.TYPE]: "type",
	[NODE_TYPES.DOCUMENT]: "document",
	[NODE_TYPES.NAMESPACE]: "namespace",
	[NODE_TYPES.TRANSLATION]: "translation",
	[NODE_TYPES.TRANSLATION_TERM]: "translation_term",
	[NODE_TYPES.TYPE_ONEOF]: "type_oneof",
	[NODE_TYPES.TYPE_ALLOF]: "type_allof",
	[NODE_TYPES.TYPE_STRUCT]: "type_struct",
	[NODE_TYPES.TYPE_LIST]: "type_list",
	[NODE_TYPES.TYPE_MAP]: "type_map",
	[NODE_TYPES.TYPE_SCALAR]: "type_scalar",
	[NODE_TYPES.TYPE_GUARD]: "type_guard",
	[NODE_TYPES.TYPE_PARAM]: "type_param",
	[NODE_TYPES.GENERIC]: "generic",
	[NODE_TYPES.SCHEMA_PARAM]: "schema_param",
	[NODE_TYPES.SCHEMA_ACTION]: "action",
	[NODE_TYPES.REF_PARAM]: "ref_param",
	[NODE_TYPES.REF_PROPERTY]: "ref_prop",
	[NODE_TYPES.REF_VARIABLE]: "ref_var",
	[NODE_TYPES.REF_SCHEMA]: "ref_schema",
	[NODE_TYPES.REF_ACTION]: "ref_action",
	[NODE_TYPES.REF_TYPE]: "ref_type",
	[NODE_TYPES.REF_TRANSLATION]: "ref_translation",
	[NODE_TYPES.LAMBDA]: "lambda",
	[NODE_TYPES.CALL]: "call",
	[NODE_TYPES.CALL_ARGUMENT]: "call_arg",
	[NODE_TYPES.CONDITION]: "cond",
	[NODE_TYPES.CONDITION_TYPE]: "cond_type",
	[NODE_TYPES.VARIABLE]: "var",
	[NODE_TYPES.UPDATE]: "update",
	[NODE_TYPES.INVOKE]: "invoke",
	[NODE_TYPES.RETURN]: "return",
	[NODE_TYPES.CONST]: "const",
	[NODE_TYPES.VALUE_LIST]: "val_list",
	[NODE_TYPES.VALUE_STRUCT]: "val_struct"
};
