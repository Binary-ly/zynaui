import btn   from './btn.js'
import card  from './card.js'
import badge from './badge.js'
import alert from './alert.js'

export default function(theme) {
  return Object.assign(
    {},
    btn(theme),
    card(theme),
    badge(theme),
    alert(theme),
  )
}
