'use strict'

var app = {}
var data = {}

app.positioner = function (id) {
  var nest_arr = id.split('_')
  var quads_arr = nest_arr[0].split('-')
  return {
    'row' : Number(nest_arr[1]),
    'col' : Number(nest_arr[2]),
    'pos' : quads_arr[0]
  }
}

app.navigator = function (pos_props) {
  var car_keys = ['up','down','left','right']
  var cardinals = {

  }

  car_keys.forEach( (dir) => {
    var this_list = []
    var tally_list = 0;
    var these_coords = [pos_props.row,pos_props.col]
    cardinals[dir] = function () { return true }
    if (data.map[pos_props.pos]) {
      if (data.map[pos_props.pos][dir]) {
        this_list = data.map[pos_props.pos][dir]
        for (var i = 0; i < 3; i++) {
          if (this_list[i] && this_list[i].length) {
            switch(i) {
              case 0 :
              case 1 :
                console.log('map.' + pos_props.pos + '.' + dir)
                console.log('list ' + i.toString())
                console.log(this_list[i])
                console.log('coords ' + i.toString())
                console.log(these_coords[i])
                if (this_list[i].indexOf(these_coords[i]) != -1) {
                  console.log('this is ' + pos_props.pos + ' ' + dir )
                  console.log('your rule is being enforced')
                  cardinals[dir] = function () { return false }
                } else {
                  console.log('this is ' + pos_props.pos + ' ' + dir )
                  console.log('list ' + i.toString() + ' did not contain ' + these_coords[i].toString())
                }
                break
              case 2 :
                this_list[i].forEach ( (list) => {
                  for (var n = 0; n < list.length; n++) {
                    if (list[n]===these_coords[n]) {
                      tally_list++
                    }
                  }
                  if (tally_list===these_coords.length) {
                    console.log('this is ' + pos_props.pos + ' ' + dir )
                    console.log('your rule is being enforced')
                    cardinals[dir] = function () { return false }
                  } else {
                    console.log('this is ' + pos_props.pos + ' ' + dir )
                    console.log('list ' + i.toString() + ' did not contain ' + these_coords)
                  }
                  tally_list = 0
                })
                break
              default :
                cardinals[dir] = function () { return null }
            }
          } else {
            console.log('there is no nav rule number ' + i.toString() )
          }
        }
      } else {
        console.log('pos_props[' + pos_props.pos + '][' + dir + '] not found')
      }
    } else {
      console.log('pos_props[' + pos_props.pos + '] not found')
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
  var nav_keys = ['up','down','right','left']
  var glyph = {}
  var pos_props = app.positioner(dom_el.id)
  var nav_props = app.navigator(pos_props)
  var pos_keys = Object.keys(pos_props)
  glyph.el = dom_el
  pos_keys.forEach( (pos_key) => {
    glyph[pos_key] = pos_props[pos_key]
  })
  nav_keys.forEach( (nav_key) => {
    glyph[nav_key] = nav_props[nav_key]
  })

  glyph.say_hello = function () {
    console.log(this.el.id)

    console.log(this.row)

    console.log(this.col)

    console.log(this.pos)

    console.log(this.up)

    console.log(this.down)

    console.log(this.left)

    console.log(this.right)


  }
  return glyph
}

var glyph_els = document.querySelectorAll('.glyph')
var active_glyph = {}
glyph_els.forEach( function (el) {
  el.addEventListener( 'click', function () {
    active_glyph = glyph_constructor(el)
    active_glyph.say_hello()
  })
})
