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

    // Custom elements default to display:inline, where clientWidth is 0 and
    // ResizeObserver reports an empty content box — the chart never sizes.
    // The Tailwind plugin ships a display:block rule, but standalone/CDN usage
    // has no plugin CSS, so self-default here. Only the exact UA default
    // ('inline') is overridden, so any author CSS still wins.
    if (getComputedStyle(this).display === 'inline') this.style.display = 'block'

    this._genreHandler = () => this._render()
    window.addEventListener('zyna-genre', this._genreHandler)

    // Re-render when the app switches genre or theme by mutating <html>
    // (data-genre attribute or a theme class). The zyna-genre window event
    // above remains supported, but consumers shouldn't need a proprietary
    // event just to recolor charts after `document.documentElement.dataset.genre = …`.
    this._mo = new MutationObserver(() => this._scheduleRender())
    this._mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-genre', 'class'],
    })

    this._ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? this.clientWidth
      // Tier 1: ignore sub-3px jitter
      if (Math.abs(w - this._lastW) < 3) return
      // Capture whether the element was previously hidden (width zero)
      const wasZero = this._lastW === 0
      this._lastW = w

      // Tier 2: coalesce multiple firings within the same animation frame
      if (this._rafId) cancelAnimationFrame(this._rafId)
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null
        clearTimeout(this._timerId)

        if (wasZero) {
          // First visibility (e.g. hidden tab just shown) — render immediately,
          // no debounce, so there is no blank-then-flash transition.
          this._render()
        } else {
          // Tier 3: trailing 150ms debounce — render once a resize drag settles
          this._timerId = setTimeout(() => this._render(), 150)
        }
      })
    })

    this._ro.observe(this)

    // Defer initial render to rAF so that a forced-reflow of clientWidth
    // returns the real layout dimension rather than 0 (pre-layout).
    // If ResizeObserver already fired and set _lastW (visible elements), skip
    // to avoid a redundant second render in the same frame.
    this._initRafId = requestAnimationFrame(() => {
      this._initRafId = null
      if (this._lastW === 0) {
        this._lastW = this.clientWidth
        this._render()
      }
    })
  }

  disconnectedCallback() {
    this._ro?.disconnect()
    this._mo?.disconnect()
    if (this._rafId)     cancelAnimationFrame(this._rafId)
    if (this._initRafId) cancelAnimationFrame(this._initRafId)
    if (this._timerId)   clearTimeout(this._timerId)
    window.removeEventListener('zyna-genre', this._genreHandler)
  }

  /**
   * Coalesces several same-turn render triggers (multiple attribute writes,
   * html-level genre mutations) into a single microtask render.
   */
  _scheduleRender() {
    if (this._attrQueued) return
    this._attrQueued = true
    queueMicrotask(() => {
      this._attrQueued = false
      if (this.isConnected) this._render()
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Writing the same value again (e.g. a React re-render re-serialising
    // identical data) must not trigger a full re-render.
    if (oldValue === newValue) return
    if (!this.isConnected) return
    // Before the initial render (_lastW unset), attribute values are picked up
    // by that render — during element upgrade this callback fires once per
    // observed attribute, and scheduling here would multiply renders.
    if (!this._lastW) return
    // Coalesce several same-turn attribute writes into a single render.
    // Microtask (not rAF) keeps updates effectively immediate — attribute
    // changes still bypass the resize debounce.
    this._scheduleRender()
  }

  /**
   * Resolves the chart's colour theme. An explicit `theme` attribute always
   * wins; otherwise genres steer it via the `--z-chart-theme` token (the five
   * light genres set it to 'light' so charts don't default to dark text on a
   * cream page); final fallback is 'dark'.
   * @returns {'dark'|'light'|string}
   */
  _theme() {
    const attr = this.getAttribute('theme')
    if (attr) return attr
    const t = getComputedStyle(this).getPropertyValue('--z-chart-theme').trim()
    return t || 'dark'
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
   * Malformed JSON gets its own warning — otherwise a typo'd `data` attribute
   * falls through to _warnEmpty's "No data provided", which actively misleads.
   * @param {string} name
   * @param {*} fallback
   * @returns {*}
   */
  _json(name, fallback) {
    const v = this.getAttribute(name)
    if (v === null) return fallback
    try { return JSON.parse(v) } catch (e) {
      if (!this.hasAttribute('data-silent')) {
        console.warn(`[${this.localName}] Malformed JSON in \`${name}\` attribute — ignoring it. ${e.message}`)
      }
      return fallback
    }
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

  /**
   * Gives the chart a text alternative: role="img" on the host, an aria-label
   * (an explicit `aria-label` attribute always wins; otherwise the generated
   * summary is applied and kept up to date on re-render), and aria-hidden on
   * the SVG so its internal <text> nodes aren't announced as a garbled stream
   * of tick values by screen readers.
   * @param {*} svg  d3 selection of the chart's <svg>
   * @param {string} generatedLabel  data-derived summary from the subclass
   */
  _applyA11y(svg, generatedLabel) {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'img')
    if (!this.getAttribute('aria-label') || this.__ariaAuto) {
      this.setAttribute('aria-label', generatedLabel)
      this.__ariaAuto = true
    }
    svg.attr('aria-hidden', 'true')
  }

  // Read from the element, not documentElement, so container-scoped token
  // overrides (e.g. a wrapper setting --zyna) reach the charts inside it.
  _cssVar(name)  { return getComputedStyle(this).getPropertyValue(name).trim() }
  _brand()     { return this._cssVar('--zyna')       || '#C9A84C' }
  _brandDark() { return this._cssVar('--zyna-dark')  || '#7A6230' }
  _success()   { return this._cssVar('--zp-success') || '#00FFB2' }
  _danger()    { return this._cssVar('--zp-danger')  || '#FF3366' }

  _render() {}
}
