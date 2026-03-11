/**
 * Shape factory — CSS-variable-driven clip-path geometry.
 *
 * Each factory accepts a CSS variable name string (e.g. 'var(--btn-corner)')
 * and returns polygon strings that reference it via calc(). This means a
 * single polygon template works at every size — size classes just update the
 * variable, and the polygon adapts automatically. No compound selectors needed.
 */
export default {
  /**
   * Chamfer — cuts top-right and bottom-left corners diagonally.
   * Default button shape.
   */
  chamfer: (v) => ({
    outer: `polygon(0 0, calc(100% - ${v}) 0, 100% ${v}, 100% 100%, ${v} 100%, 0 calc(100% - ${v}))`,
    inner: `polygon(1px 1px, calc(100% - calc(${v} + 1px)) 1px, calc(100% - 1px) calc(${v} + 1px), calc(100% - 1px) calc(100% - 1px), calc(${v} + 1px) calc(100% - 1px), 1px calc(100% - calc(${v} + 1px)))`,
  }),

  /**
   * Notch — cuts all 4 corners symmetrically (octagon).
   */
  notch: (v) => ({
    outer: `polygon(${v} 0%, calc(100% - ${v}) 0%, 100% ${v}, 100% calc(100% - ${v}), calc(100% - ${v}) 100%, ${v} 100%, 0% calc(100% - ${v}), 0% ${v})`,
    inner: `polygon(calc(${v} + 1px) 1px, calc(100% - calc(${v} + 1px)) 1px, calc(100% - 1px) calc(${v} + 1px), calc(100% - 1px) calc(100% - calc(${v} + 1px)), calc(100% - calc(${v} + 1px)) calc(100% - 1px), calc(${v} + 1px) calc(100% - 1px), 1px calc(100% - calc(${v} + 1px)), 1px calc(${v} + 1px))`,
  }),

  /**
   * Parallelogram — both sides angled, military data-chip aesthetic.
   * Used by badges.
   */
  parallelogram: (v) => `polygon(${v} 0%, 100% 0%, calc(100% - ${v}) 100%, 0% 100%)`,

  /**
   * Pill — inset(0 round 9999px) as clip-path, NOT border-radius.
   * Using clip-path (instead of border-radius + overflow:hidden) is critical:
   *  • clip-path is applied BEFORE filter in the rendering pipeline, so
   *    drop-shadow traces the pill outline rather than the rectangular bounding box.
   *  • clip-path clips pseudo-elements (::after scan fill) automatically,
   *    preventing the rectangular scan-fill artefact on hover.
   */
  pill: { clipPath: 'inset(0 round 9999px)', innerClip: 'inset(1.5px round 9999px)' },

  /**
   * Sharp — zero border-radius, rectangular inset inner clip.
   * clip-path: inset(0) clips to the full element box (visually identical to none)
   * but ensures filter traces the element before compositing and clips pseudo-elements.
   */
  sharp: { clipPath: 'inset(0)', borderRadius: '0', innerClip: 'inset(1.5px)' },
}
