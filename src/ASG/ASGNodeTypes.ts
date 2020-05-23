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

export enum ASG_TYPE {
	DOCUMENT = "document",
	NAMESPACE = "namespace",
	DL_IMPORT = "dl_import",
	DL_USE = "dl_use",
	DL_TYPE = "dl_type",
	DL_TYPE_PARAM = "dl_type_param",
	DL_SCHEMA = "dl_schema",
	DL_SCHEMA_PARAM = "dl_schema_param",
	DL_TRANSLATION = "dl_translation",
	DL_VARIABLE = "dl_variable",
	DL_RETURN = "dl_return",
	DL_ACTION = "dl_action",
	TYPE_STRUCT = "type_struct",
	TYPE_ONEOF = "type_oneof",
	TYPE_ALLOF = "type_allof",
	REF_TYPE = "ref_type",
	REF_VARIABLE = "ref_variable",
	REF_PARAM = "ref_param",
	REF_PROPERTY = "ref_property",
	REF_ACTION = "ref_action",
	REF_SCHEMA = "ref_schema",
	REF_TRANSLATION = "ref_translation",
	CALL_ARGUMENT = "call_argument",
	OP_INVOKE = "op_invoke",
	OP_SET = "op_set",
	VAL_SCALAR = "val_scalar",
	VAL_LIST = "val_list",
	VAL_STRUCT = "val_struct"
}
