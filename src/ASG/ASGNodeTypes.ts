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
	DL_TYPE = "dl_type",
	DL_SCHEMA = "dl_schema",
	DL_TRANSLATION = "dl_translation",
	TYPE_STRUCT = "type_struct",
	TYPE_ONEOF = "type_oneof",
	TYPE_ALLOF = "type_allof",
	REF_TYPE = "ref_type"
}
