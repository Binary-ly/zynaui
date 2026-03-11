/**
 * Alert component — CSS variable API
 *
 * To create a new alert style, set these variables on your class:
 *
 *   --alert-bar-color    Left luminescent bar colour
 *   --alert-bg           Background tint
 *   --alert-color        Text colour
 *   --alert-shadow       box-shadow (near glow + inset depth)
 *   --alert-title-shadow .alert-title text-shadow luminescence
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
    padding: '0.875rem 1.25rem',
    // --z-alert-radius / --z-alert-bar-width: genre structural tokens (set in :root)
    borderRadius: 'var(--z-alert-radius)',
    borderLeft: 'var(--z-alert-bar-width) solid var(--alert-bar-color)',
    background: 'var(--alert-bg)',
    color: 'var(--alert-color)',
    fontSize: '0.82rem',
    lineHeight: '1.65',
    position: 'relative',
    boxShadow: 'var(--alert-shadow)',
  }

  return {
    // ── Base — also targets [role="alert"] for accessible markup ──────────────
    '.alert': base,
    '[role="alert"]': base,

    '.alert-icon': {
      flexShrink: '0',
      width: '1.1rem',
      height: '1.1rem',
      marginTop: '0.1rem',
    },

    // Terminal-style title with // comment prefix
    '.alert-title': {
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
        opacity: '0.38',
        fontWeight: '400',
        letterSpacing: '0',
      },
    },

    // ── Semantic variants — just override variables ────────────────────────────

    // Alien mint — system online
    '.alert-success': {
      '--alert-bar-color':    'var(--z-color-success)',
      '--alert-bg':           'color-mix(in srgb, var(--z-color-success) 5.5%, transparent)',
      '--alert-color':        'color-mix(in srgb, var(--z-color-success) 88%, transparent)',
      '--alert-shadow':       '0 0 30px color-mix(in srgb, var(--z-color-success) 8%, transparent), inset 4px 0 18px color-mix(in srgb, var(--z-color-success) 5%, transparent), inset 0 0 40px color-mix(in srgb, var(--z-color-success) 2.5%, transparent)',
      '--alert-title-shadow': '0 0 12px color-mix(in srgb, var(--z-color-success) 65%, transparent)',
    },

    // Neon crimson — breach detected
    '.alert-danger': {
      '--alert-bar-color':    'var(--z-color-danger)',
      '--alert-bg':           'color-mix(in srgb, var(--z-color-danger) 5.5%, transparent)',
      '--alert-color':        'color-mix(in srgb, var(--z-color-danger) 88%, transparent)',
      '--alert-shadow':       '0 0 30px color-mix(in srgb, var(--z-color-danger) 8%, transparent), inset 4px 0 18px color-mix(in srgb, var(--z-color-danger) 5%, transparent), inset 0 0 40px color-mix(in srgb, var(--z-color-danger) 2.5%, transparent)',
      '--alert-title-shadow': '0 0 12px color-mix(in srgb, var(--z-color-danger) 65%, transparent)',
    },

    // Amber — caution state
    '.alert-warning': {
      '--alert-bar-color':    'var(--z-color-warning)',
      '--alert-bg':           'color-mix(in srgb, var(--z-color-warning) 5.5%, transparent)',
      '--alert-color':        'color-mix(in srgb, var(--z-color-warning) 88%, transparent)',
      '--alert-shadow':       '0 0 24px color-mix(in srgb, var(--z-color-warning) 7%, transparent), inset 4px 0 14px color-mix(in srgb, var(--z-color-warning) 4%, transparent)',
      '--alert-title-shadow': '0 0 10px color-mix(in srgb, var(--z-color-warning) 55%, transparent)',
    },

    // Electric cyan — incoming signal
    '.alert-info': {
      '--alert-bar-color':    'var(--z-color-info)',
      '--alert-bg':           'color-mix(in srgb, var(--z-color-info) 5.5%, transparent)',
      '--alert-color':        'color-mix(in srgb, var(--z-color-info) 88%, transparent)',
      '--alert-shadow':       '0 0 30px color-mix(in srgb, var(--z-color-info) 8%, transparent), inset 4px 0 18px color-mix(in srgb, var(--z-color-info) 5%, transparent), inset 0 0 40px color-mix(in srgb, var(--z-color-info) 2.5%, transparent)',
      '--alert-title-shadow': '0 0 12px color-mix(in srgb, var(--z-color-info) 65%, transparent)',
    },

    // WCAG AA: bumped from 0.50 → 0.65
    '.alert-neutral': {
      '--alert-bar-color': 'var(--z-color-border-dim)',
      '--alert-bg':        'var(--z-color-overlay)',
      '--alert-color':     'var(--z-color-text-dim)',
    },

    '.alert-dark': {
      '--alert-bar-color': 'color-mix(in srgb, white 14%, transparent)',
      '--alert-bg':        'color-mix(in srgb, white 3%, transparent)',
      '--alert-color':     'var(--z-color-text-dim)',
    },

    // ── Shape modifiers ────────────────────────────────────────────────────────
    '.alert-sharp': { borderRadius: '0', overflow: 'hidden' },
    '.alert-pill': {
      borderRadius: '9999px',
      paddingLeft: '1.25rem',
      paddingRight: '1.25rem',
      borderLeft: 'none',
      boxShadow: 'inset 0 0 0 2px var(--alert-bar-color)',
    },
  }
}
