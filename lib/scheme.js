'use strict'

class Scheme {

  constructor(n,s,v,d,schema) {
    this.schema = schema
    this.stories = []
  }

  tesseract(x,y,z,r) {
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
        for (var p = 0; p < this.schema.stanzas.props.length; p++) {
          prop = this.schema.stanzas.props[p]
          this_stanza[prop] = this.schema.stanzas['default'][p]
        }

        theme_name = this.schema.themes[this_stanza.theme]
        for (var tp = 0; tp < this.schema.themes.props.length; tp++) {
          this_theme[this.schema.themes.props[tp]] = this.schema.themes[this_stanza.theme][tp]
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
}

//module.exports = Scheme
