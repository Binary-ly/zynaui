/**
 * React wrapper attribute normalisation.
 *
 * Real bug: React 19 removes a custom-element attribute whose value is boolean
 * false, so <ZynaCandlestick show-axis={false}> rendered the axis anyway. The
 * wrappers now pass every pass-through prop through attrs(), which stringifies
 * booleans and leaves everything else alone.
 */
import { describe, test, expect } from 'vitest'
import { attrs } from '../../src/react/attrs.js'

describe('attrs()', () => {
  test('stringifies booleans so custom elements receive "true"/"false"', () => {
    expect(attrs({ 'show-axis': false, 'show-values': true })).toEqual({ 'show-axis': 'false', 'show-values': 'true' })
  })

  test('leaves strings, numbers, objects, and functions untouched', () => {
    const style = { color: 'red' }
    const onClick = () => {}
    const out = attrs({ id: 'x', ticks: 3, style, onClick, className: 'a', 'aria-label': 'chart' })
    expect(out).toEqual({ id: 'x', ticks: 3, style, onClick, className: 'a', 'aria-label': 'chart' })
    expect(out.style).toBe(style)
    expect(out.onClick).toBe(onClick)
  })

  test('returns a new object and handles an empty rest', () => {
    const src = {}
    expect(attrs(src)).toEqual({})
    expect(attrs(src)).not.toBe(src)
  })
})
