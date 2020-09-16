'use strict'

var schema = {}

schema.themes = {
  'props' : ['tile_path','wall_path','color_scheme','glyph_char'],
  'color_names' : [
    'grey',
    'gold',
    'cornflowerblue',
    'forestgreen',
    'olivedrab',
    'dimgrey',
    'indigo',
    'khaki',
    'aliceblue',
    'whitesmoke',
    'burlywood',
    'gold',
    'firebrick',
    'tomato',
    'lavendar',
    'azure',
    'darkslategrey',
    'maroon',
    'darkgreen',
    'lightslategray',
    'silver',
    'darkblue',
    'goldenrod',
    'skyblue',
    'black'
  ],
  'prop_table': [
    []
  ],
  'color_schema' : [
    {}
  ],
  'default' : [
    '../moon.jpg',
    '../scorched-earth.jpg',
    'grey',
    '_'
  ]
}

schema.stanzas = {
  'props' : ['theme','tactics','locality'],
  'prop_table' : [
    []
  ],
  'default' : [
    'default',
    {},
    {}
  ]
}
