# Zyna UI — TODO & Roadmap

---

## BI Platform Adapters

Port all 5 Zyna charts (`waffle`, `timeline`, `nightingale`, `lollipop`, `orbital`) to run natively inside **Power BI**, **Tableau**, and **Looker**.

### Status
- [ ] Phase 1 — Shared core (extract render functions)
- [ ] Phase 2 — Looker adapter
- [ ] Phase 3 — Tableau adapter
- [ ] Phase 4 — Power BI adapter

---

### Architecture — `ChartRenderContext`

All 5 chart render functions are refactored to accept this interface instead of reading from `this._attr()` / `this._json()` / `this.clientWidth`. The Web Component wrapper keeps working — it just constructs this object and calls the render function.

```typescript
interface ChartRenderContext {
  container: HTMLElement
  data: Array<{label: string; value: number; note?: string; color?: string; [key: string]: any}>
  width: number
  height: number
  colors: string[]
  theme: 'light' | 'dark'
  formatValue?: (value: number) => string  // platform-provided formatter; omit if using pre-formatted strings
  showValues?: boolean                      // default: true
  ringThickness?: number                    // orbital only; default: computed from dimensions
  tickCount?: number                        // lollipop only; default: auto
  onSelect?: (items: any[]) => void
  onTooltip?: (event: MouseEvent, datum: any) => void
}
```

Each platform adapter is ~50–100 lines that maps the platform's lifecycle and data into this context. The render function is identical on all three platforms.

---

### Phase 1 — Shared core (3–4 days)

Extract each `_render()` from the Web Component class into a standalone exported function:

```
src/charts/renderers/
  waffle.js
  timeline.js
  nightingale.js
  lollipop.js
  orbital.js
```

Web Component `_render()` becomes a thin wrapper:
```js
_render() {
  renderWaffle({
    container: this,
    data: this._json('data', []),
    width: this.clientWidth || 700,
    colors: [this._attr('color', '#C9A84C')],
    theme: this._attr('theme', 'dark'),
    formatValue: v => this._fmt(v, this._attr('label-format', '')),
    showValues: this._attr('show-values', 'true') !== 'false',
    // ...
  })
}
```

No existing functionality changes. This is pure refactoring.

---

### Phase 2 — Looker (6–7 days total, do first)

**Why first**: Fastest feedback loop. No CLI, no build tool required. Single JS file + two callbacks.

**File per chart**: `looker/zyna-waffle.js`, etc. Deploy via Looker Admin or `manifest.lkml`.

**D3 loading**: Declare as dependency in `manifest.lkml`:
```lkml
visualization: {
  id: "zyna_waffle"
  label: "Zyna Waffle"
  url: "https://yourdomain.com/zyna-waffle.js"
  dependencies: ["https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"]
}
```
Use the UMD browser bundle (`d3.min.js`) — D3 v7 ESM cannot be loaded as a CDN dependency directly.

**API contract**:
```javascript
looker.plugins.visualizations.add({
  id: "zyna_waffle",
  label: "Zyna Waffle",
  options: {
    color:       { type: "string",  display: "color",   label: "Accent Color",   default: "#C9A84C", section: "Style", order: 1 },
    muted_color: { type: "string",  display: "color",   label: "Muted Color",    default: "#8A8478", section: "Style", order: 2 },
    theme:       { type: "string",  display: "radio",   label: "Theme",          default: "dark",    values: [{"Dark":"dark"},{"Light":"light"}], section: "Style", order: 3 },
    show_values: { type: "boolean",                     label: "Show Values",    default: true,      section: "Style", order: 4 },
    // chart-specific options below...
  },
  create(element, config) {
    element.innerHTML = '<div style="width:100%;height:100%"></div>'
    this._container = element.querySelector('div')
  },
  updateAsync(data, element, config, queryResponse, details, done) {
    this.clearErrors()
    if (!queryResponse?.fields.dimensions.length || !queryResponse?.fields.measures.length) {
      this.addError({ title: "Missing data", message: "Need 1 dimension + 1 measure." })
      done(); return
    }
    const dim = queryResponse.fields.dimensions[0].name
    const mes = queryResponse.fields.measures[0].name
    const noteField = queryResponse.fields.dimensions[1]?.name  // optional — timeline only

    const chartData = data.map(row => ({
      label: row[dim].rendered || String(row[dim].value),
      value: row[mes].value || 0,
      note: noteField ? (row[noteField]?.rendered || null) : undefined
    }))
    // Use row[mes].rendered for pre-formatted display strings where applicable

    renderWaffle({
      container: this._container,
      data: chartData,
      width: element.clientWidth,
      height: element.clientHeight,
      colors: [config.color || '#C9A84C'],
      theme: config.theme || 'dark',
      showValues: config.show_values !== false,
    })
    done()  // CRITICAL — required for PDF export
  }
})
```

**`note` field (timeline only)**: Second dimension by convention. Document in the viz description that users should place the annotation field in the second dimension slot.

**Highlight / muted-color**: `config.highlight_label` (text input) + `config.muted_color` (color picker) in `options`.

**Resize**: Use `ResizeObserver` on `element` — more reliable than `window` resize since Looker doesn't always re-call `updateAsync` on resize.

---

### Phase 3 — Tableau Viz Extensions (9–11 days)

**Requirements**: Tableau Desktop / Server **2024.1+** (Viz Extensions GA in 2024.2). Tableau Cloud supported. Tableau Public NOT supported.

**File structure per chart**:
```
tableau/zyna-waffle/
  zyna-waffle.trex         # XML manifest
  index.html               # entry point
  zyna-waffle.js           # adapter + bundled renderer
  tableau.extensions.1.latest.js
```

**`.trex` manifest** (use `<worksheet-extension>` not `<dashboard-extension>`):
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest manifest-version="0.1" xmlns="http://www.tableau.com/xml/extension_manifest">
  <worksheet-extension id="com.zynaui.waffle" extension-version="0.1.0">
    <default-locale>en_US</default-locale>
    <name resource-id="name"/>
    <description>Zyna Waffle Chart</description>
    <author name="ZynaUI" email="hello@zynaui.com" organization="ZynaUI" website="https://zynaui.com"/>
    <min-api-version>1.1</min-api-version>
    <source-location>
      <url>https://yourdomain.com/tableau/zyna-waffle/index.html</url>
    </source-location>
    <icon/>
    <permissions>
      <permission>full data</permission>
    </permissions>

    <encoding id="category">
      <display-name>Category</display-name>
      <data-spec><data-type>string</data-type></data-spec>
      <role-spec><role-type>discrete-dimension</role-type></role-spec>
      <fields max-count="1"/>
      <encoding-icon token="letter-c"/>
    </encoding>

    <encoding id="measure">
      <display-name>Value</display-name>
      <data-spec><data-type>numeric</data-type></data-spec>
      <role-spec><role-type>continuous-measure</role-type></role-spec>
      <fields max-count="1"/>
      <encoding-icon token="letter-v"/>
    </encoding>

    <!-- Timeline only: add a third encoding for notes -->
    <!--
    <encoding id="note">
      <display-name>Note</display-name>
      <data-spec><data-type>string</data-type></data-spec>
      <role-spec><role-type>discrete-dimension</role-type></role-spec>
      <fields max-count="1"/>
      <encoding-icon token="letter-n"/>
    </encoding>
    -->
  </worksheet-extension>
  <resources>
    <resource id="name"><text locale="en_US">Zyna Waffle</text></resource>
  </resources>
</manifest>
```

**Adapter JS**:
```javascript
tableau.extensions.initializeAsync().then(() => {
  const worksheet = tableau.extensions.worksheetContent.worksheet
  worksheet.addEventListener(tableau.TableauEventType.SummaryDataChanged, render)
  render()

  // ResizeObserver is reliable inside Tableau's iframe
  new ResizeObserver(() => render()).observe(document.body)
})

async function render() {
  const spec = await worksheet.getVisualSpecificationAsync()
  const marks = spec.marksSpecifications[spec.activeMarksSpecificationIndex]
  const encMap = {}
  for (const enc of marks.encodings) encMap[enc.id] = enc.field.name

  if (!encMap.category || !encMap.measure) return

  const reader = await worksheet.getSummaryDataReaderAsync()
  const dt = await reader.getAllPagesAsync()
  await reader.releaseAsync()

  const catCol  = dt.columns.find(c => c.fieldName === encMap.category)
  const valCol  = dt.columns.find(c => c.fieldName === encMap.measure)
  const noteCol = encMap.note ? dt.columns.find(c => c.fieldName === encMap.note) : null

  const chartData = dt.data.map(row => ({
    label: row[catCol.index].formattedValue,   // use formattedValue — locale-aware
    value: parseFloat(row[valCol.index].value) || 0,
    note: noteCol ? row[noteCol.index].formattedValue : undefined
  }))

  renderWaffle({
    container: document.getElementById('chart'),
    data: chartData,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    colors: ['#C9A84C'],
    theme: 'dark',
    showValues: true,
  })
}
```

**Highlight / muted-color / show-values / etc.**: Use Tableau **worksheet parameters**. User creates a parameter (e.g. string "Highlight Label"), extension reads it via `worksheet.getParametersAsync()`. Clunky UX compared to PBI/Looker — document as a known limitation.

**Deployment**: Host on HTTPS. Tableau Server/Cloud admin adds URL to safe list (Settings → Extensions). Local dev: `npx http-server -p 8765`, browse to `.trex` in Tableau Desktop.

---

### Phase 4 — Power BI Custom Visuals (13–15 days)

**Setup** (one-time per developer):
```bash
npm install -g powerbi-visuals-tools@latest   # current: 7.0.2, API types: 5.11.0
pbiviz --install-cert
pbiviz new zynaWaffle
cd zynaWaffle && npm install
npm install d3-selection d3-scale d3-shape d3-array --save-dev
```

**Breaking change in v7.0.0**: Node.js polyfills (crypto, buffer, stream) removed. All deps must be browser-compatible — our D3 modules are fine.

**`capabilities.json`** (waffle / most charts):
```json
{
  "dataRoles": [
    { "displayName": "Category", "name": "category", "kind": "Grouping" },
    { "displayName": "Value",    "name": "measure",  "kind": "Measure"  },
    { "displayName": "Note",     "name": "note",     "kind": "Grouping" }
  ],
  "dataViewMappings": [{
    "conditions": [
      { "category": {"max": 1}, "measure": {"max": 1}, "note": {"max": 1} }
    ],
    "categorical": {
      "categories": { "select": [{"bind":{"to":"category"}}, {"bind":{"to":"note"}}] },
      "values": { "select": [{ "bind": { "to": "measure" } }] }
    }
  }],
  "objects": {
    "colorSelector": {
      "properties": {
        "fill": { "type": { "fill": { "solid": { "color": true } } } }
      }
    },
    "labels": {
      "properties": {
        "show":       { "type": { "bool": {} } },
        "color":      { "type": { "fill": { "solid": { "color": true } } } },
        "mutedColor": { "type": { "fill": { "solid": { "color": true } } } }
      }
    }
  },
  "privileges": []
}
```

**`visual.ts`**:
```typescript
import powerbi from "powerbi-visuals-api"
import { select } from "d3-selection"
import { renderWaffle } from "./renderers/waffle"  // shared render function

export class Visual implements powerbi.extensibility.visual.IVisual {
  private container: HTMLElement

  constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
    this.container = options.element
  }

  public update(options: powerbi.extensibility.visual.VisualUpdateOptions): void {
    const dv = options.dataViews?.[0]
    if (!dv?.categorical?.categories) return

    const cats  = dv.categorical.categories[0].values
    const vals  = dv.categorical.values[0].values
    const notes = dv.categorical.categories[1]?.values  // optional

    // Use highlights for muted rendering — PBI provides this for free via cross-filtering
    const highlights = dv.categorical.values[0].highlights  // null = not highlighted

    const data = cats.map((cat, i) => ({
      label: String(cat),
      value: Number(vals[i]) || 0,
      note: notes ? String(notes[i] ?? '') : undefined,
      highlighted: !highlights || highlights[i] !== null
    }))

    const objects = dv.metadata?.objects
    const accentColor  = objects?.labels?.color?.solid?.color  || '#C9A84C'
    const mutedColor   = objects?.labels?.mutedColor?.solid?.color || '#8A8478'
    const showValues   = objects?.labels?.show as boolean ?? true

    renderWaffle({
      container: this.container,
      data,
      width: options.viewport.width,
      height: options.viewport.height,
      colors: [accentColor],
      theme: 'dark',
      showValues,
    })
  }
}
```

**Native cross-filtering (Power BI only)**: `dv.categorical.values[0].highlights` is a parallel array — `null` entries are non-highlighted (from cross-filter). Map directly to our muted-color logic. This feature is free and doesn't require any extra work beyond reading the array.

**Sandboxing**: No external HTTP unless `WebAccess` privilege declared. No `localStorage`. Use `storageService` from `IVisualHost` if persistence needed. Our charts make no network calls — no issues.

**Packaging**:
```bash
pbiviz package    # outputs dist/zynaWaffle.pbiviz
```

**Sideloading for testing**: Power BI Service → Settings → Developer settings → "Power BI Developer mode" → run `pbiviz start` → Developer visual appears in Visualizations pane with live reload. Or import `.pbiviz` directly via Visualizations pane → "..." → "Import a visual from a file".

---

### Effort Estimates

| Phase | Scope | Estimate |
|---|---|---|
| Phase 1 — Shared core | Extract all 5 render functions | 3–4 days |
| Phase 2 — Looker | 5 chart adapters | 6–7 days |
| Phase 3 — Tableau | 5 chart adapters + .trex manifests | 9–11 days |
| Phase 4 — Power BI | 5 chart adapters + TypeScript + capabilities | 13–15 days |
| **Total** | All 5 charts × 3 platforms | **31–37 days** |

First chart on each platform carries 1–2 days of setup/SDK learning overhead. Each subsequent chart on the same platform is faster because the adapter boilerplate is already established.

---

### Key References

- Power BI: `microsoft/PowerBI-visuals-sampleBarChart` — canonical D3 reference implementation
- Power BI: `deneb-viz/deneb` — most mature D3-adjacent certified visual (Vega/Vega-Lite)
- Tableau: `tableau/extensions-api` repo — samples + runtime library
- Looker: `looker-open-source/custom_visualizations_v2` — D3-based chord, sunburst, sankey, treemap examples (closest to our chart types)
- No universal D3-to-BI adapter exists. The thin-adapter pattern above is the correct approach.

---

### Notes

- **Looker Studio** (formerly Google Data Studio) is a completely separate system from Looker — different API (`dscc.subscribeToData()`), different hosting, different config format. If needed, it requires a fifth platform adapter on top of the four above.
- Shadow DOM: our charts already render without Shadow DOM (directly into the custom element host) — this removes the biggest refactoring concern flagged in the research.
- D3 v7 is confirmed compatible with all three platforms. The main pitfall is using UMD builds for CDN loading (Looker) vs ESM for bundled builds (PBI, Tableau).
