'use strict'

var app = {}
var data = {}

app.positioner = function (id) {
  var nest_arr = id.split('_')
  var coords_arr = nest_arr.split('-')
  return {
    'row' : nest_arr[0],
    'col' : nest_arr[1],
    'pos' : coords_arr[0]
  }
}

app.navigator = function (pos_props) {

  var cardinals = {
    'up' : {},
    'down' : {},
    'right' : {},
    'left' : {}
  }

  cardinals.forEach( (dir) => {
    var this_list = []
    var these_coords = [pos_props.row,pos_props.col]
    if (data.map[pos_props.pos][dir]) {
      this_list = data.map[pos_props.pos][dir]
      for (var i = 0; i < 3; i++) {
        if (this_list[i].length) {
          switch(i) {
            case 0 :
            case 1 :
              if (this_list[i].indexOf(these_coords[i])>-1) {
                cardinals[dir] = function () { return false }
              }
              break
            case 2 :
              if (this_list[i].indexOf(these_coords)>-1) {
                cardinals[dir] = function () { return false }
              }
              break
            default :
          }
        }
      }
    }
  })
  return cardinals
}

/*
{
  'nav_input_with_exclusions' :  [
    [], //excluded rows
    [], //excluded cols
    [], //excluded row-col pairs in [n,n],...  format
  ]
}
*/

data.map = {
  'nw' : {
    'up' : [
      [0]
    ],
    'left' : [
      [],
      [0]
    ]
  },
  'n' : {
    'up' : [
      [],
      [],
      [
        [0,0],
        [3,3]
      ]
    ]
  },
  'ne' : {
    'up' : [
      [0]
    ],
    'right' : [
      [],
      [0]
    ]
  },
  'e' : {
    'right' : [
      [],
      [],
      [
        [0,3],
        [3,3]
      ]
    ]
  },
  'se' : {
    'down' : [
      [3]
    ],
    'right' : [
      [],
      [3]
    ]
  },
  's' : {
    'down' : [
      [],
      [],
      [
        [3,0],
        [3,3]
      ]
    ]
  },
  'sw' : {
    'down' : [
      [3]
    ],
    'left' : [
      [],
      [0]
    ]
  },
  'w' : {
    'left' : [
      [],
      [],
      [
        [0,0],
        [3,0]
      ]
    ]
  }
}



function glyph_constructor(dom_el) {
  var glyph = {}
  var pos_props = app.positioner(dom_el.id)
  var nav_props = app.navigator(pos_props)
  glyph.element = dom_el
  glyph.row = pos_props.row;
  glyph.col = pos_props.col;
  glyph.pos = pos_props.pos;



  return glyph
}

var glyphs = document.querySelectorAll('.glyph')
var active_glyph = {

}

active_glyph = {}
