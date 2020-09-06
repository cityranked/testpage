
'use strict'

var tiles = document.querySelectorAll('.tile')
var glyphs = {}
if (tiles) {
  tiles.forEach( (tile) => {
    for (var i = 0; i < 4; i++) {
      var glyph_row = document.createElement('div')
      glyph_row.className = 'glyphs flex-row flex-center'
      tile.appendChild(glyph_row)
      for (var ii = 0; ii < 4; ii++) {
        var glyph = document.createElement('div')
        glyph.className = 'glyph'
        glyph.id = tile.id + '_' + (i).toString() + '_' + (ii).toString()
        glyph_row.appendChild(glyph)
      }
    }
  })
}
glyphs = document.querySelectorAll('glyphs')
if (glyphs) {

}
