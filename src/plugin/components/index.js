const btn   = require('./btn')
const card  = require('./card')
const badge = require('./badge')
const alert = require('./alert')

module.exports = function(theme) {
  return Object.assign(
    {},
    btn(theme),
    card(theme),
    badge(theme),
    alert(theme),
  )
}
