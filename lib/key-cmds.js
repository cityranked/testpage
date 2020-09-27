'use strict'
var keys = {}
keys.dirs = {
  'NumpadSubtract':'desc',
  'NumpadAdd':'asc',
  'Numpad6':'right',
  'Numpad4':'left',
  'Numpad2':'down',
  'Numpad8':'up'
}

window.addEventListener('keydown', function (event) {
  //console.log(event.code)
  if (Object.keys(keys.dirs).indexOf(event.code.toString())>-1) {
    console.log(keys.dirs[event.code])
    active_glyph[keys.dirs[event.code]]()
  }

})
