'use strict'

var data = {}

data.demo_schema = {
  'stories' : [
    // stories indexed by id number

      {
      // stanzas associated by row_col coordinates
        '0_0' : {
         'theme' : {
           'tile_path' : '../moon.jpg',
           'wall_path' : '../scorched-earth.jpg',
           'color_scheme' : 'grey',
           'glyph_char' : '_'
         },
         'tactics' : {
           //
         },
         'locality' : {
           'borders_on' : {
             's': 0,
             'w': undefined
           },
           'coords' : [
             1,0,0
           ]
         }

       } // ends first stanza

      //  ends stanzas
    } // ends first story
  ] // ends all stories
} // ends schema

data.stories = []

data.tesseract = function (x,y,z,r) {
  var this_stanza = {}
  var this_theme = {}
  var theme_name = ''
  var prop = ''
  var row_col = ''
  var rowcols = [
    [y,x],
    [y+1,x],
    [y,x+1],
    [y,x-1],
    [y-1,x]
  ]
  var compass_props = ['c','a','n','e','s','w','d']
  var rowcol = []
  var s = [1,5,1]
  var compass_index = [
    0,
    null,
    compass_props.length-1
  ]
  for (var nn = z; nn < z + s.length; nn++) {
    this.stories.push([])
    for (var t = 0; t < s[nn]; t++) {
      row_col = rowcols[t][0].toString() + '_' + rowcols[t][1].toString()
      for (var p = 0; p < schema.stanzas.props.length; p++) {
        prop = schema.stanzas.props[p]
        this_stanza[prop] = schema.stanzas['default'][p]
      }

      theme_name = schema.themes[this_stanza.theme]
      for (var tp = 0; tp < schema.themes.props.length; tp++) {
        this_theme[schema.themes.props[tp]] = schema.themes[this_stanza.theme][tp]
      }
      this_stanza['theme'] = this_theme
      if (compass_index[nn]!=null) {
        this_stanza['locality'][compass_props[compass_index[nn]]] = row_col
      } else {
        if (t===0) {
          for (var c = 1; c < compass_props.length; c++) {
            this_stanza['locality'][compass_props[c]] = (rowcols[c]) ?
              rowcols[t][0].toString() + '_' + rowcols[t][1].toString() :
              '0_0'
          }
        } else {
          this_stanza['locality'][compass_props[t]] =
            rowcols[t][0].toString() + '_' + rowcols[t][1].toString()
        }
      }
      this['stories'][nn][row_col] = this_stanza
    }
  }
  //return new_scheme
}

data.construct_schema = function (
  n, // number of stories
  s, // number of stanzas;
  v, // variance
  d, // dispersion
  ) {
  var new_scheme = {'stories':[]}

  var this_stanza = {}
  var this_theme = {}
  var residual = 0
  var prop = ''
  var row_col = ''
  var rowcols = [
    [0,0],
    [1,0],
    [0,1],
    [0,-1],
    [-1,0]
  ]
  var compass_props = ['c','a','n','e','s','w','d']
  var compass_index = []
  var rowcol = []

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
    //default settings for tesseract configuration

    console.log('no base story count--default to single tesseract model')
    new_scheme.tesseract = this.tesseract
    this.tesseract(0,0,0,0)
  }
  return new_scheme
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
          case 'w' :
          case 'e' :
            new_pos = 'compass'
            break   
          default :
        }
      }
      break
    default :
  }
  return new_pos
}

data.get_new_stanza_pos = function (cardinal,floor_coords) {
  var new_coords = floor_coords
  var poles = {
    'w' : 'e',
    'e' : 'w',
    's' : 'n',
    'n' : 's',
    'a' : 'compass',
    'd' : 'compass'
  }
  var coords  = [
    {
      'w' : -1,
      'e' : 1
    },
    {
      'n' : 1,
      's' : -1
    },
    {
      'a' : 1,
      'd' : -1
    }

  ]
  for (var i = 0; i < floor_coords.length; i++) {
    if (coords[i][poles[cardinal]]) {
      new_coords[i] += coords[i][poles[cardinal]]
    }
  }
  return { pos : poles[cardinal], coords: new_coords }
}

//module.exports = Mapper
