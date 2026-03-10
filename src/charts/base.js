/**
 * ZynaChart — base class for all Zyna chart Web Components.
 *
 * Provides:
 *   - ResizeObserver lifecycle  (connectedCallback / disconnectedCallback)
 *   - Attribute-change re-render via observedAttributes (override in subclass)
 *   - _attr(name, fallback)     safe attribute read with fallback
 *   - _json(name, fallback)     JSON-parsed attribute with fallback
 *   - _uid                      stable per-instance ID for SVG defs
 *
 * Resize debouncing strategy (three-tier):
 *   1. Ignore sub-3px width changes — sub-pixel jitter from scrollbar appearance
 *      or fractional device-pixel-ratio shouldn't trigger a full re-render.
 *   2. rAF gate — coalesces multiple ResizeObserver firings within the same frame
 *      into a single _render() call (browsers may fire several times per frame).
 *   3. 150ms trailing debounce — suppresses the rapid succession of observations
 *      during a live window resize drag, then renders once when the user stops.
 */
export class ZynaChart extends HTMLElement {
  connectedCallback() {
    this._lastW  = 0
    this._rafId  = null
    this._timerId = null

    this._ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? this.clientWidth
      // Tier 1: ignore sub-3px jitter
      if (Math.abs(w - this._lastW) < 3) return
      this._lastW = w

      // Tier 2: coalesce multiple firings within the same animation frame
      if (this._rafId) cancelAnimationFrame(this._rafId)
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null

        // Tier 3: trailing 150ms debounce — render once the resize drag settles
        clearTimeout(this._timerId)
        this._timerId = setTimeout(() => this._render(), 150)
      })
    })

    this._ro.observe(this)
    this._render()
  }

  disconnectedCallback() {
    this._ro?.disconnect()
    if (this._rafId)   cancelAnimationFrame(this._rafId)
    if (this._timerId) clearTimeout(this._timerId)
  }

  attributeChangedCallback() {
    // Attribute changes bypass the resize debounce and render immediately.
    if (this.isConnected) this._render()
  }

  /**
   * Returns the raw string value of an attribute, or `fallback` if absent.
   * @param {string} name
   * @param {*} fallback
   * @returns {string|*}
   */
  _attr(name, fallback) {
    const v = this.getAttribute(name)
    return v !== null ? v : fallback
  }

  /**
   * Returns the JSON-parsed value of an attribute, or `fallback` if absent or unparseable.
   * @param {string} name
   * @param {*} fallback
   * @returns {*}
   */
  _json(name, fallback) {
    try { return JSON.parse(this.getAttribute(name)) } catch { return fallback }
  }

  /**
   * A stable, per-instance unique string for use in SVG `id` / `url()` references.
   * Uses `crypto.randomUUID()` when available, falling back to `Math.random()`.
   * @returns {string}
   */
  get _uid() {
    if (!this.__uid) {
      this.__uid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10)
    }
    return this.__uid
  }

  /**
   * Logs a dev-friendly warning when a chart is mounted with no data.
   * Silenced in production by a `data-silent` attribute on the element.
   * @param {string} tag  Custom element tag name e.g. 'zyna-waffle'
   */
  _warnEmpty(tag) {
    if (!this.hasAttribute('data-silent')) {
      console.warn(`[${tag}] No data provided. Add a \`data\` attribute with a JSON array.`)
    }
  }

  /**
   * Formats a numeric value using a D3-style format string.
   * Supports: '$' prefix, ',' thousands separator, '.Nf' decimals, '%' (×100 + suffix).
   * Returns the value unchanged if no format string is provided.
   * @param {number|string} value
   * @param {string} fmt  e.g. '$,.0f' | ',.2f' | '.1%' | ''
   * @returns {string}
   */
  _fmt(value, fmt) {
    if (!fmt) return value
    const v = Number(value)
    if (isNaN(v)) return String(value)
    const isPct    = fmt.includes('%')
    const isDollar = fmt.includes('$')
    const commas   = fmt.includes(',')
    const decMatch = fmt.match(/\.(\d+)/)
    const decimals = decMatch ? parseInt(decMatch[1]) : (isPct ? 1 : 0)
    const n        = isPct ? v * 100 : v
    const str      = commas
      ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : n.toFixed(decimals)
    return (isDollar ? '$' : '') + str + (isPct ? '%' : '')
  }

  _render() {}
}
