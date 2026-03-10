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
module.exports = function(theme) {
  const base = {
    '--alert-bar-color':    'rgba(255,255,255,0.10)',
    '--alert-bg':           'rgba(255,255,255,0.02)',
    '--alert-color':        'rgba(240,235,224,0.65)',  // WCAG AA ≥4.5:1 on dark
    '--alert-shadow':       'none',
    '--alert-title-shadow': 'none',

    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.875rem 1.25rem',
    borderRadius: '0 3px 3px 0',
    borderLeft: '3px solid var(--alert-bar-color)',
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
      fontFamily: "'DM Mono', 'Fira Code', ui-monospace, monospace",
      fontSize: '0.62rem',
      fontWeight: '700',
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
      marginBottom: '0.2rem',
      textShadow: 'var(--alert-title-shadow)',

      '&::before': {
        content: '"// "',
        color: 'currentColor',
        opacity: '0.38',
        fontWeight: '400',
        letterSpacing: '0',
      },
    },

    // ── Semantic variants — just override variables ────────────────────────────

    // Alien mint — system online
    '.alert-success': {
      '--alert-bar-color':    '#00FFB2',
      '--alert-bg':           'rgba(0,255,178,0.055)',
      '--alert-color':        'rgba(0,255,178,0.88)',
      '--alert-shadow':       '0 0 30px rgba(0,255,178,0.08), inset 4px 0 18px rgba(0,255,178,0.05), inset 0 0 40px rgba(0,255,178,0.025)',
      '--alert-title-shadow': '0 0 12px rgba(0,255,178,0.65)',
    },

    // Neon crimson — breach detected
    '.alert-danger': {
      '--alert-bar-color':    '#FF3366',
      '--alert-bg':           'rgba(255,51,102,0.055)',
      '--alert-color':        'rgba(255,51,102,0.88)',
      '--alert-shadow':       '0 0 30px rgba(255,51,102,0.08), inset 4px 0 18px rgba(255,51,102,0.05), inset 0 0 40px rgba(255,51,102,0.025)',
      '--alert-title-shadow': '0 0 12px rgba(255,51,102,0.65)',
    },

    // Amber — caution state
    '.alert-warning': {
      '--alert-bar-color':    '#FFB800',
      '--alert-bg':           'rgba(255,184,0,0.055)',
      '--alert-color':        'rgba(255,184,0,0.88)',
      '--alert-shadow':       '0 0 24px rgba(255,184,0,0.07), inset 4px 0 14px rgba(255,184,0,0.04)',
      '--alert-title-shadow': '0 0 10px rgba(255,184,0,0.55)',
    },

    // Electric cyan — incoming signal
    '.alert-info': {
      '--alert-bar-color':    '#00D4FF',
      '--alert-bg':           'rgba(0,212,255,0.055)',
      '--alert-color':        'rgba(0,212,255,0.88)',
      '--alert-shadow':       '0 0 30px rgba(0,212,255,0.08), inset 4px 0 18px rgba(0,212,255,0.05), inset 0 0 40px rgba(0,212,255,0.025)',
      '--alert-title-shadow': '0 0 12px rgba(0,212,255,0.65)',
    },

    // WCAG AA: bumped from 0.50 → 0.65
    '.alert-neutral': {
      '--alert-bar-color': 'rgba(255,255,255,0.12)',
      '--alert-bg':        'rgba(255,255,255,0.025)',
      '--alert-color':     'rgba(240,235,224,0.65)',
    },

    '.alert-dark': {
      '--alert-bar-color': 'rgba(255,255,255,0.14)',
      '--alert-bg':        'rgba(255,255,255,0.03)',
      '--alert-color':     'rgba(240,235,224,0.70)',
    },
  }
}
