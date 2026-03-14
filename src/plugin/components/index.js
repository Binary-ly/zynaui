import btn   from './btn/btn.js'
import card  from './card/card.js'
import badge from './badge/badge.js'
import alert from './alert/alert.js'

export default function(theme) {
  return Object.assign(
    {},
    btn(theme),
    card(theme),
    badge(theme),
    alert(theme),
  )
}
