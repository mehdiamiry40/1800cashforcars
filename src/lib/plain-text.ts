import { isValidElement, type ReactNode } from "react";

/**
 * The words in a piece of JSX as a reader sees them: the text of every element, in order, without the markup.
 * A page that writes an answer as JSX, with links in it, can hand the same JSX to its FAQ schema, so the
 * schema always says what the page says.
 *
 * It follows `children` only. A component that makes its text from other props is not read.
 */
export function plainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return plainText(node.props.children);
  return "";
}
