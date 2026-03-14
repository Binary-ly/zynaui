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
   * Diagonal — cuts top-right and bottom-left corners diagonally (2-corner chamfer).
   */
  diagonal: (v) => ({
    outer: `polygon(0 0, calc(100% - ${v}) 0, 100% ${v}, 100% 100%, ${v} 100%, 0 calc(100% - ${v}))`,
    inner: `polygon(1px 1px, calc(100% - calc(${v} + 1px)) 1px, calc(100% - 1px) calc(${v} + 1px), calc(100% - 1px) calc(100% - 1px), calc(${v} + 1px) calc(100% - 1px), 1px calc(100% - calc(${v} + 1px)))`,
  }),

  /**
   * Bevel — cuts all 4 corners symmetrically (octagon).
   */
  bevel: (v) => ({
    outer: `polygon(${v} 0%, calc(100% - ${v}) 0%, 100% ${v}, 100% calc(100% - ${v}), calc(100% - ${v}) 100%, ${v} 100%, 0% calc(100% - ${v}), 0% ${v})`,
    inner: `polygon(calc(${v} + 1px) 1px, calc(100% - calc(${v} + 1px)) 1px, calc(100% - 1px) calc(${v} + 1px), calc(100% - 1px) calc(100% - calc(${v} + 1px)), calc(100% - calc(${v} + 1px)) calc(100% - 1px), calc(${v} + 1px) calc(100% - 1px), 1px calc(100% - calc(${v} + 1px)), 1px calc(${v} + 1px))`,
  }),

  /**
   * Slant — both sides angled (parallelogram).
   * Used by badges.
   */
  slant: (v) => `polygon(${v} 0%, 100% 0%, calc(100% - ${v}) 100%, 0% 100%)`,

  /**
   * Rounded — inset(0 round 9999px) as clip-path, NOT border-radius.
   * Using clip-path (instead of border-radius + overflow:hidden) is critical:
   *  • clip-path is applied BEFORE filter in the rendering pipeline, so
   *    drop-shadow traces the rounded outline rather than the rectangular bounding box.
   *  • clip-path clips pseudo-elements (::after scan fill) automatically,
   *    preventing the rectangular scan-fill artefact on hover.
   */
  rounded: { clipPath: 'inset(0 round 9999px)', innerClip: 'inset(1.5px round 9999px)' },

  /**
   * Rect — zero border-radius, rectangular inset inner clip.
   * clip-path: inset(0) clips to the full element box (visually identical to none)
   * but ensures filter traces the element before compositing and clips pseudo-elements.
   */
  rect: { clipPath: 'inset(0)', borderRadius: '0', innerClip: 'inset(1.5px)' },
}
