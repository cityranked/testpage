'use strict'

var data = {}

data.schema = {
  'stories' : [
    // stories indexed by id number
    {
      'stanzas' : [
      // stanzas indexed by id number
        {
         'theme' : {
           'tile_path' : '../moon.jpg',
           'wall_path' : '../scorched-earth.jpg',
           'color_scheme' : 'grey',
           'glyph_char' : '_'
         },
         'tactics' : {
         },
         'locality' : [
         ]
       } // ends first stanza

     ] //  ends stanzas
    } // ends first story
  ] // ends all stories
} // ends schema

data.get_schema = function (
  n, // number of stories
  s, // number of stanzas;
  v // variance
  ) {
  var schema = {'stories':[]}
  var this_stanza = {}
  var this_theme = {}
  var residual
  if (n) {
    for (var i = 0; i < n; n++) {
      if (s) {
        for (var ii = 0; ii < s; ii++) {
        }
      } else {
        console.log('no base stanza count--use default scheme')
      }
    }
  } else {
    s = (!s) ? 5 : 0
    for (var t = 0; t < s; t++) {
      this_stanza[prop[p]] = schema.stanza['default'][p]
      this_theme = schema.themes[schema.stanza['theme']]
      this_stanza['theme'] = this_theme
      schema['stories'][0].push(this_stanza)
    }
    console.log('no base story count--default to single story model')
  }
  return schema
}

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

data.get_new_stanza_pos = function (cardinal) {
  var poles = {
    'w' : 'e',
    'e' : 'w',
    's' : 'n',
    'n' : 's'
  }
  return poles[cardinal]
}
