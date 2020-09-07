'use strict'


var app = {}
var data = {}

app.table = {}

app.positioner = function (id) {
  var nest_arr = id.split('_')
  var quads_arr = nest_arr[0].split('-')
  return {
    'row' : Number(nest_arr[1]),
    'col' : Number(nest_arr[2]),
    'pos' : quads_arr[0]
  }
}

app.relocator = function (row_col,pos) {
  var this_pos = (pos) ? pos : active_glyph.el.id.split('_')[0]
  var target = '_' + row_col[0].toString() + '_' + row_col[1].toString()
  var el = (pos[0]==='!') ? null : document.getElementById(this_pos + target)
  if (el) {
    if (app.table[this_pos + target]) {
      active_glyph = app.table[this_pos + target]
    } else {
      active_glyph = glyph_constructor(el)
    }
  } else if (pos[0]==='!') {
    console.log('you go ' + pos  + '!')
  } else {
    console.log('no HTML element with ID ' + this_pos + target)
  }
}

app.navigator = function (pos_props) {
  var car_keys = ['up','down','left','right']
  var cardinals = {}

  car_keys.forEach( (dir) => {
    var this_list = []
    var tally_list = 0;
    var these_coords = [pos_props.row,pos_props.col]

    cardinals[dir] = function () {

      var new_loc = data.get_directions(dir,pos_props.pos,these_coords)
      app.relocator(new_loc.coords,new_loc.pos)

    }

    if (data.map[pos_props.pos]) {
      if (data.map[pos_props.pos][dir]) {

        this_list = data.map[pos_props.pos][dir]

        for (var i = 0; i < 3; i++) {
          if (this_list[i] && this_list[i].length) {
            switch(i) {
              case 0 :
              case 1 :
                /*
                console.log('map.' + pos_props.pos + '.' + dir)
                console.log('list ' + i.toString())
                console.log(this_list[i])
                console.log('coords ' + i.toString())
                console.log(these_coords[i])
                */
                if (this_list[i].indexOf(these_coords[i]) != -1) {
                  /*
                  console.log('this is ' + pos_props.pos + ' ' + dir )
                  console.log('your rule is being enforced')
                  */
                  cardinals[dir] = function () { return false }
                } else {
                  /*
                  console.log('this is ' + pos_props.pos + ' ' + dir )
                  console.log('list ' + i.toString() + ' did not contain ' + these_coords[i].toString())
                  */
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
                    /*
                    console.log('this is ' + pos_props.pos + ' ' + dir )
                    console.log('your rule is being enforced')
                    */
                    cardinals[dir] = function () { return false }
                  } else {
                    /*
                    console.log('this is ' + pos_props.pos + ' ' + dir )
                    console.log('list ' + i.toString() + ' did not contain ' + these_coords)
                    */
                  }
                  tally_list = 0
                })
                break
              default :
                cardinals[dir] = function () { return null }
            }
          } else {
            //console.log('there is no nav rule number ' + i.toString() )
          }
        }
      } else {
        //console.log('pos_props[' + pos_props.pos + '][' + dir + '] not found')
      }
    } else {
      //console.log('pos_props[' + pos_props.pos + '] not found')
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
        [0,3]
      ]
    ]
  },
  'ne' : {
    'up' : [
      [0]
    ],
    'right' : [
      [],
      [3]
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

data.exits = {
  'n' : {
    'up' :[
    [0,1],
    [0,2]
   ]
  },
  'e' : {
    'right' :[
      [1,3],
      [2,3]
    ]
  },
  's' : {
    'down' : [
      [3,1],
      [3,2]
    ]
  },
  'w' : {
    'left' : [
      [1,0],
      [2,0]
    ]
  }
}


data.get_directions = function (dir,pos,row_col) {
  var new_pos = ''
  var new_coords = []
  var new_row = row_col[0]
  var new_col = row_col[1]
  var exit = false

  if (data.exits[pos]) {
    if (data.exits[pos][dir]) {
      data.exits[pos][dir].forEach( (coords) => {
        if (coords[0]===row_col[0] && coords[1]===row_col[1]) {
          exit = true
        }
      })
    }
  }

  switch(dir) {
    case 'up' :
      new_row = (row_col[0]-1 > -1) ? row_col[0]-1 : 3
      break
    case 'down' :
      new_row = (row_col[0]+1 < 4) ? row_col[0]+1 : 0
      break
    case 'left' :
      new_col = (row_col[1]-1 > -1) ? row_col[1]-1 : 3
      break
    case 'right' :
      new_col = (row_col[1]+1 < 4) ? row_col[1]+1 : 0
      break
    default :
  }

  if ( Math.abs(row_col[0]-new_row) > 1 || Math.abs(row_col[1]-new_col) > 1 ) {
    new_pos = (exit)? '!' + pos : data.get_new_position(dir,pos)
  }

  new_coords = [new_row, new_col]

  return { coords: new_coords, pos: new_pos }
}

data.get_new_position = function (dir,pos) {
  var new_pos = ''
  var slope

  switch(dir) {
    case 'up' :
    case 'down' :
      slope = (dir==='down') ? 's' : 'n'

      switch(pos[0]) {
        case 's' :
        case 'n' :
          new_pos = (pos[1]) ? pos[1] : 'compass'
          break
        case 'c' :
          new_pos = slope
          break
        case 'w' :
        case 'e' :
          new_pos = slope + pos[0]
          break
        default :
      }

      break
    case 'left' :
    case 'right' :
      slope = (dir==='left') ? 'w' : 'e'
      if (pos[1]) {

        switch (pos[1]) {
          case 'e' :
          case 'w' :
            new_pos = pos[0]
            break
          case 'o' :
            new_pos = slope
            break
          default :
        }

      } else {

        switch (pos[0]) {
          case 'n' :
          case 's' :
            new_pos = pos[0] + slope
            break
          case 'c' :
            new_pos = slope
            break
          default :
        }
        }
      break
    default :
  }
  return new_pos
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
  glyph.say_hello()
  app.table[dom_el.id] = glyph
  return app.table[dom_el.id]
}

var glyph_els = document.querySelectorAll('.glyph')
var active_glyph = {}

glyph_els.forEach( function (el) {

  el.addEventListener( 'click', function () {
    active_glyph = glyph_constructor(el)

  })
})
