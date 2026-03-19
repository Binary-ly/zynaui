/**
 * applyPrefix — prefix all CSS class selectors in a ZynaUI CSS-in-JS object.
 *
 * Recursively walks the object keys and rewrites any `.class-name` token found
 * in a CSS selector string, replacing it with `.{prefix}class-name`.
 *
 * Rules:
 *   • Only class selectors (`.foo`, `:where(.foo)`, `.foo:hover` …) are touched.
 *   • At-rules (@property, @keyframes, @media …) keys are passed through unchanged.
 *   • Attribute selectors ([role="button"]) and element selectors (html, body) are
 *     passed through unchanged.
 *   • CSS custom property NAMES and VALUES are never prefixed — ZynaUI's 3-tier
 *     token system (--zp-*, --z-*, --btn-* …) is already namespaced and modifying
 *     it would break user-authored custom variants.
 *   • Nested objects (e.g. @media wrappers) are handled recursively.
 *
 * @param {object} cssObj  CSS-in-JS object from any component or motion function.
 * @param {string} prefix  Class prefix string (e.g. 'zui-').
 * @returns {object}
 */
export function applyPrefix(cssObj, prefix) {
  if (!prefix) return cssObj
  const out = {}
  for (const [key, value] of Object.entries(cssObj)) {
    const newKey = prefixSelector(key, prefix)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse into nested rule objects (@media, &:hover wrappers, etc.)
      out[newKey] = applyPrefix(value, prefix)
    } else {
      out[newKey] = value
    }
  }
  return out
}

/**
 * Rewrite every `.class-name` token in a single CSS selector string.
 * Handles comma-separated lists, :where()/:is()/:not() pseudo-functions,
 * and relative selectors (&:hover, &::before …).
 *
 * @param {string} selector
 * @param {string} prefix
 * @returns {string}
 */
function prefixSelector(selector, prefix) {
  // Pass at-rules through unchanged
  if (selector.startsWith('@')) return selector
  // Pass relative selectors (&…) through unchanged — they are nested child rules
  // whose outer selector already carries the prefix
  if (selector.startsWith('&')) return selector
  // Replace every `.class-name` token in the selector string
  // \. matches the dot; [\w-]+ captures the full class identifier (letters, digits, hyphens)
  return selector.replace(/\.([\w-]+)/g, `.${prefix}$1`)
}
