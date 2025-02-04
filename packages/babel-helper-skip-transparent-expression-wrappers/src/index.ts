import {
  isParenthesizedExpression,
  isTSAsExpression,
  isTSNonNullExpression,
  isTSTypeAssertion,
  isTypeCastExpression,
} from "@babel/types";

import type * as t from "@babel/types";
import type { NodePath } from "@babel/traverse";

export type TransparentExprWrapper =
  | t.TSAsExpression
  | t.TSTypeAssertion
  | t.TSNonNullExpression
  | t.TypeCastExpression
  | t.ParenthesizedExpression;

// A transparent expression wrapper is an AST node that most plugins will wish
// to skip, as its presence does not affect the behaviour of the code. This
// includes expressions used for types, and extra parenthesis. For example, in
// (a as any)(), this helper can be used to skip the TSAsExpression when
// determining the callee.
export function isTransparentExprWrapper(
  node: t.Node,
): node is TransparentExprWrapper {
  return (
    isTSAsExpression(node) ||
    isTSTypeAssertion(node) ||
    isTSNonNullExpression(node) ||
    isTypeCastExpression(node) ||
    isParenthesizedExpression(node)
  );
}

export function skipTransparentExprWrappers(
  path: NodePath<t.Expression>,
): NodePath<t.Expression> {
  while (isTransparentExprWrapper(path.node)) {
    path = path.get("expression");
  }
  return path;
}
