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

import { IASGSearchScope } from "./IASGSearchScope";
import { ASG_TYPE } from "./ASGNodeTypes";
import { IASGNode } from "./IASGNode";
import { IASGDocument } from "./IASGDocument";

export function ASGFindSymbol(scope: IASGSearchScope, symbol: string) {

	const res : Array<IASGNode> = [];

	const addNodes = (nodes: Array<IASGNode>) => {

		for (let i = 0; i < nodes.length; i++) {
			res.push(nodes[i]);
		}

	}

	for (let i = 0; i < scope.length; i++) {

		const node = scope[i];

		switch(node.node) {

		}

	}

	return res;

}
