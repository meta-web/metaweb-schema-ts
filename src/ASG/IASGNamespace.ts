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

import { ASG_TYPE } from "./ASGNodeTypes";
import { IASGNode } from "./IASGNode";
import { IDocumentRange } from "../Shared/IDocumentRange";
import { IASGDeclarationType } from "./IASGDeclarationType";

/**
 * ASG Namespace
 */
export interface IASGNamespace extends IASGNode<ASG_TYPE.NAMESPACE> {
	/** Nested namespaces */
	namespaces: {
		[K: string]: IASGNamespace;
	}

	/** Types */
	types: {
		[K: string]: Array<IASGDeclarationType>;
	}

	/** Schemas */
	schemas: {
		[K: string]: Array<IASGNode<ASG_TYPE.DL_SCHEMA>>;
	}

	/** Translations */
	translations: {
		[K: string]: Array<any> /* @todo */
	},

	/** Parse info */
	parseInfo?: {
		/** Position of identifiers where namespace was declared. */
		id: Array<IDocumentRange>
	}
}