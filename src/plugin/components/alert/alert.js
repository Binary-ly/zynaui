/**
 * Alert component — CSS variable API
 *
 * To create a new alert style, set these variables on your class:
 *
 *   --alert-bar-color    Left accent bar colour
 *   --alert-bg           Background tint (override directly for custom variants)
 *   --alert-color        Text colour
 *   --alert-shadow       box-shadow (near glow + inset depth)
 *   --alert-title-shadow .alert-title text-shadow luminescence
 *
 * Genre structural tokens (set on html by ops.js defaults, overridden by genre CSS selectors):
 *
 *   --z-alert-radius         border-radius (Ops = 0 3px 3px 0, Cyberpunk = 0)
 *   --z-alert-bar-width      Bar thickness (Ops = 3px, Cyberpunk = 5px)
 *   --z-alert-prefix         .alert-title::before content (Ops = "// ", Cyberpunk = "> ")
 *   --z-alert-bg-opacity     Semantic variant background fill intensity.
 *                            Built-in variants use color-mix with this percentage so
 *                            genres can ramp the fill from subtle (Ops) to vivid (Cyberpunk)
 *                            without overriding every individual variant.
 *                            (Ops = 5.5%, Cyberpunk = 14%)
 *   --z-alert-border         Full-perimeter border (Ops = none, Cyberpunk = 1px neon-tinted).
 *                            Supports var(--alert-bar-color) — lazy CSS evaluation resolves
 *                            the component-level variable even though the token is on html.
 *   --z-alert-prefix-opacity Opacity of the .alert-title::before prefix ("// " in Ops, "> " in Cyberpunk).
 *                            (Ops = 0.38, Cyberpunk = 0.55)
 *   --z-alert-bar-glow       box-shadow on the bar ::before pseudo-element.
 *                            Supports var(--alert-bar-color) for the same reason.
 *                            (Ops = none, Cyberpunk = neon glow)
 *   --z-alert-texture        background-image overlay (Ops = none, Cyberpunk = scan-lines)
 *   --z-alert-padding-top    Padding top (Ops = 0.875rem, Cyberpunk = top-bar-adjusted)
 *   --z-alert-padding-left   Padding left (Ops = bar-adjusted, Cyberpunk = 1.25rem)
 *   --z-alert-bar-inset      inset shorthand for bar position (Ops = left, Cyberpunk = top)
 *   --z-alert-bar-w          Bar element width (Ops = bar-width, Cyberpunk = 100%)
 *   --z-alert-bar-h          Bar element height (Ops = 100%, Cyberpunk = bar-width)
 *   --z-alert-bar-radius     Bar border-radius (Ops = rounded start, Cyberpunk = 0)
 *
 * Accessibility: the base rule also targets [role="alert"] so elements with
 * correct ARIA markup receive the same visual styles without needing the class.
 * Body text colours are set to ≥0.65 opacity to clear WCAG 2.1 AA (≥4.5:1)
 * against the default dark card background.
 *
 * ─── Example ───────────────────────────────────────────────────────────────
 *   .alert-plasma {
 *     --alert-bar-color:    #BF5FFF;
 *     --alert-bg:           rgba(139, 0, 255, 0.055);
 *     --alert-color:        rgba(191, 95, 255, 0.88);
 *     --alert-shadow:       0 0 30px rgba(139,0,255,0.08),
 *                           inset 4px 0 18px rgba(139,0,255,0.05);
 *     --alert-title-shadow: 0 0 12px rgba(191,95,255,0.65);
 *   }
 */
export default function(theme) {
  const base = {
    '--alert-bar-color':    'rgba(255,255,255,0.10)',
    '--alert-bg':           'rgba(255,255,255,0.02)',
    '--alert-color':        'var(--z-color-text-dim)',  // WCAG AA ≥4.5:1 on dark
    '--alert-shadow':       'none',
    '--alert-title-shadow': 'none',

    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    // --z-alert-padding-top/left: genre structural tokens. Ops = left bar pushes left padding.
    // Cyberpunk = top bar pushes top padding instead; left padding resets to 1.25rem.
    padding: 'var(--z-alert-padding-top) 1.25rem 0.875rem var(--z-alert-padding-left)',
    borderRadius: 'var(--z-alert-radius)',
    // --z-alert-border: genre structural token. Ops = none. Cyberpunk = full-perimeter
    // neon border using the variant's bar colour (lazy CSS evaluation resolves
    // var(--alert-bar-color) at the element level even though the token is on html).
    border: 'var(--z-alert-border)',
    // --z-alert-texture: genre structural token — Cyberpunk overlays scan-line texture.
    // backgroundImage stacks above backgroundColor so the texture composites cleanly.
    backgroundImage: 'var(--z-alert-texture)',
    backgroundColor: 'var(--alert-bg)',
    color: 'var(--alert-color)',
    fontSize: '0.82rem',
    lineHeight: '1.65',
    position: 'relative',
    boxShadow: 'var(--alert-shadow)',

    // Accent bar as a pseudo-element so it supports box-shadow (glow).
    // border-left cannot produce a glow; ::before with absolute positioning can.
    // All bar geometry is tokenised so genres can reposition the bar (Ops = left,
    // Cyberpunk = top) without any scoped CSS overrides.
    '&::before': {
      content: '""',
      position: 'absolute',
      // --z-alert-bar-inset: "top right bottom left". Ops = '0 auto 0 0' (left bar, full height).
      // Cyberpunk = '0 0 auto 0' (top bar, full width).
      inset: 'var(--z-alert-bar-inset)',
      width: 'var(--z-alert-bar-w)',
      height: 'var(--z-alert-bar-h)',
      background: 'var(--alert-bar-color)',
      boxShadow: 'var(--z-alert-bar-glow)',
      borderRadius: 'var(--z-alert-bar-radius)',
    },
  }

  return {
    // ── Base — also targets [role="alert"] for accessible markup ──────────────
    ':where(.alert)': base,
    ':where([role="alert"])': base,

    ':where(.alert-icon)': {
      flexShrink: '0',
      width: '1.1rem',
      height: '1.1rem',
      marginTop: '0.1rem',
    },

    // Terminal-style title with // comment prefix
    ':where(.alert-title)': {
      fontFamily: 'var(--z-font-mono)',
      fontSize: '0.62rem',
      fontWeight: '700',
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
      marginBottom: '0.2rem',
      textShadow: 'var(--alert-title-shadow)',

      '&::before': {
        // --z-alert-prefix: genre structural token — Ops = "// ", Cyberpunk = "> "
        content: 'var(--z-alert-prefix)',
        color: 'currentColor',
        // --z-alert-prefix-opacity: genre structural token — Ops = subdued 0.38, Cyberpunk = 0.55
        opacity: 'var(--z-alert-prefix-opacity)',
        fontWeight: '400',
        letterSpacing: '0',
      },
    },

    // ── Semantic variants ─────────────────────────────────────────────────────
    // --alert-bg uses var(--z-alert-bg-opacity) so genres control fill intensity
    // without overriding each variant individually.
    // Ops default: 5.5% (subtle tint). Cyberpunk: 14% (vivid, saturated fill).

    // Alien mint — system online
    ':where(.alert-success)': {
      '--alert-bar-color':    'var(--z-color-success)',
      '--alert-bg':           'color-mix(in oklch, var(--z-color-success) var(--z-alert-bg-opacity), transparent)',
      '--alert-color':        'color-mix(in oklch, var(--z-color-success) 88%, transparent)',
      '--alert-shadow':       '0 0 30px color-mix(in oklch, var(--z-color-success) 8%, transparent), inset 4px 0 18px color-mix(in oklch, var(--z-color-success) 5%, transparent), inset 0 0 40px color-mix(in oklch, var(--z-color-success) 2.5%, transparent)',
      '--alert-title-shadow': '0 0 12px color-mix(in oklch, var(--z-color-success) 65%, transparent)',
    },

    // Neon crimson — breach detected
    ':where(.alert-danger)': {
      '--alert-bar-color':    'var(--z-color-danger)',
      '--alert-bg':           'color-mix(in oklch, var(--z-color-danger) var(--z-alert-bg-opacity), transparent)',
      '--alert-color':        'color-mix(in oklch, var(--z-color-danger) 88%, transparent)',
      '--alert-shadow':       '0 0 30px color-mix(in oklch, var(--z-color-danger) 8%, transparent), inset 4px 0 18px color-mix(in oklch, var(--z-color-danger) 5%, transparent), inset 0 0 40px color-mix(in oklch, var(--z-color-danger) 2.5%, transparent)',
      '--alert-title-shadow': '0 0 12px color-mix(in oklch, var(--z-color-danger) 65%, transparent)',
    },

    // Amber — caution state
    ':where(.alert-warning)': {
      '--alert-bar-color':    'var(--z-color-warning)',
      '--alert-bg':           'color-mix(in oklch, var(--z-color-warning) var(--z-alert-bg-opacity), transparent)',
      '--alert-color':        'color-mix(in oklch, var(--z-color-warning) 88%, transparent)',
      '--alert-shadow':       '0 0 24px color-mix(in oklch, var(--z-color-warning) 7%, transparent), inset 4px 0 14px color-mix(in oklch, var(--z-color-warning) 4%, transparent)',
      '--alert-title-shadow': '0 0 10px color-mix(in oklch, var(--z-color-warning) 55%, transparent)',
    },

    // Electric cyan — incoming signal
    ':where(.alert-info)': {
      '--alert-bar-color':    'var(--z-color-info)',
      '--alert-bg':           'color-mix(in oklch, var(--z-color-info) var(--z-alert-bg-opacity), transparent)',
      '--alert-color':        'color-mix(in oklch, var(--z-color-info) 88%, transparent)',
      '--alert-shadow':       '0 0 30px color-mix(in oklch, var(--z-color-info) 8%, transparent), inset 4px 0 18px color-mix(in oklch, var(--z-color-info) 5%, transparent), inset 0 0 40px color-mix(in oklch, var(--z-color-info) 2.5%, transparent)',
      '--alert-title-shadow': '0 0 12px color-mix(in oklch, var(--z-color-info) 65%, transparent)',
    },

    ':where(.alert-neutral)': {
      '--alert-bar-color': 'var(--z-color-border-dim)',
      '--alert-bg':        'var(--z-color-overlay)',
      '--alert-color':     'var(--z-color-text-dim)',
    },

    ':where(.alert-dark)': {
      '--alert-bar-color': 'color-mix(in oklch, white 14%, transparent)',
      '--alert-bg':        'color-mix(in oklch, white 3%, transparent)',
      '--alert-color':     'var(--z-color-text-dim)',
    },

    // ── Size modifiers ─────────────────────────────────────────────────────────
    // Top padding is hardcoded to produce a visible size difference. Both values
    // safely exceed the maximum bar height (Cyberpunk top bar = 5px ≈ 0.3rem),
    // so content never overlaps the bar in either genre.
    // --z-alert-padding-left is preserved to keep the left-bar offset in Ops
    // (Cyberpunk resets it to flat 1.25rem via its structural token).
    ':where(.alert-sm)': {
      padding: '0.55rem 1rem 0.55rem var(--z-alert-padding-left)',
      fontSize: '0.74rem',
      lineHeight: '1.55',
    },

    ':where(.alert-lg)': {
      padding: '1.1rem 1.5rem 1.1rem var(--z-alert-padding-left)',
      fontSize: '0.9rem',
      lineHeight: '1.7',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    ':where(.alert-square)': { borderRadius: '0' },
    ':where(.alert-round)': {
      borderRadius: '9999px',
      // Reset padding-left — round has no visible bar
      padding: '0.875rem 1.25rem',
      border: 'none',
      boxShadow: 'inset 0 0 0 var(--z-alert-bar-width) var(--alert-bar-color)',
      // Hide the absolute bar pseudo-element — beta uses inset ring instead
      '&::before': { display: 'none' },
    },
  }
}
