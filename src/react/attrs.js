/**
 * Normalise pass-through props for a custom element.
 *
 * Custom elements only ever see string attributes. React 19 treats a boolean
 * prop on a custom element as a boolean attribute: `true` sets it to "" and
 * `false` REMOVES it — so `show-axis={false}` on <ZynaCandlestick> silently
 * vanished and the chart fell back to its default (axis shown). React 18
 * stringified both. Booleans are stringified here so both majors send the
 * literal "true"/"false" the charts parse; everything else (style objects,
 * refs, handlers, className) is left for React to handle.
 *
 * @param {Record<string, unknown>} props
 * @returns {Record<string, unknown>}
 */
export function attrs(props) {
  const out = {}
  for (const [k, v] of Object.entries(props)) out[k] = typeof v === 'boolean' ? String(v) : v
  return out
}
