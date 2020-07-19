'use strict'

var dom = {

  field_counters : document.querySelectorAll('.field-counter'),

  text_fields : document.querySelectorAll('.json-text'),

  select_weekday : document.querySelector('#select-weekday'),
}

var data = {
  schema_props : {'text':'text','link':['sameas','offercatalog'],'hours':'weekday'},
  text_schema : {},
  link_schema : {'sameas':[],'offercatalog':[]},
  hours_schema : {},
  open_weekdays : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  using_weekdays : [],
}

var app = {

  focus_click : null,

  init : function (weekdays) {

    this.info.populate_options(weekdays,'#select-weekday')

    dom.select_weekday.addEventListener( 'click', function () {
      if (app.focus_click) {
        console.log('selected:')
        console.log(this.value)
        var index = data.open_weekdays.indexOf(this.value)
        var new_open_weekdays = []
        for (var i = 0; i < data.open_weekdays.length; i++) {
          if (i != index) {
            new_open_weekdays.push(data.open_weekdays[i])
          }
        }
        data.open_weekdays = new_open_weekdays
        data.using_weekdays.push(this.value)
        app.info.populate_options(data.open_weekdays,'#select-weekday')
        app.info.populate_options_fields(data.using_weekdays,'#biz-hours-builder')
        app.focus_click = null
      } else {
        app.focus_click = true
      }

    })

    dom.field_counters.forEach( (counter) => {
      counter.addEventListener( 'change', function () {
        var container = this.
          parentElement.parentElement.parentElement
        var parent =  container.querySelector('.flex-fields')
        var type = container.id.replace('-builder','')
        var new_table = app.links[type](this.value)
        parent.innerHTML = ''
        parent.appendChild(new_table)
        console.log(this.id)
        console.log(this.value)

      })
    })

  },

  'nap' : {

  },

  'info' : {
    week: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    row : {'open-hour': 'Open:','open-min':'','open-mode':'','close-hour':'Close:','close-min':'','close-mode':''},
    mode : ['AM','PM'],
    min : ['00','15','30','45'],

    populate_options : function (weekdays,parent_id) {
      var parent = document.querySelector(parent_id)
      parent.innerHTML = ''
      weekdays.forEach( (day) => {
        var node = document.createTextNode(day)
        var el = document.createElement('option')
        el.appendChild(node)
        el.value = day
        el.className = 'weekday-option'
        parent.appendChild(el)
      })
    },

    populate_options_fields : function (weekdays,parent_id) {

      var parent = document.querySelector(parent_id).querySelector('.flex-fields')
      var new_table = document.createElement('div')
      var table = {}
      var day_index = 0;
      var sorted_weekdays = []

      new_table.className = 'flex-field-table'

      app.info.week.forEach( (day) => {
        if (data.using_weekdays.indexOf(day) > -1) {
          sorted_weekdays.push(day)
        }
      })

      sorted_weekdays.forEach( (day_name) => {
        var input_tree = {}
        var wrapper = document.createElement('div')
        var day_label = document.createElement('h5')
        var value = ''
        var day_text = document.createTextNode(day_name)

        day_label.className = 'day-label'
        wrapper.className = 'flex-row flex-start json-weekday'
        day_label.appendChild(day_text)
        wrapper.appendChild(day_label)

        Object.keys(app.info.row).forEach( (keyname) => {
          var type = keyname.replace('open-','').replace('close-','')
          var input = {}
          var label = document.createElement('label')

          switch (type) {
            case 'hour' :
              input = document.createElement('input')
              input.type = 'number'
              input.setAttribute('min','1')
              input.setAttribute('max','12')
              break
            case 'min' :
            case 'mode' :
              input = document.createElement('select')
              app.info[type].forEach( (mode) => {
                var el = document.createElement('option')
                el.value = mode;
                el.innerHTML = mode;
                input.appendChild(el)
              })
              break
            default :
          }

          value = (document.querySelector('#' + day_name + '_' + keyname)) ?
            document.querySelector('#' + day_name + '_' + keyname).value :
              ( document.querySelector('.' + keyname) ?
                document.querySelector('.' + keyname).value : '' )

          day_index++

          if (data.hours_schema[day_name]) {
            data.hours_schema[day_name][keyname] = value
          } else {
            data.hours_schema[day_name] = {}
            data.hours_schema[day_name][keyname] = value
          }

          input.className = keyname;
          input.id = day_name + '_' + keyname
          input.value = value
          label.innerHTML = app.info.row[keyname]
          wrapper.appendChild(label)
          wrapper.appendChild(input)
        })
        new_table.appendChild(wrapper)
      })
      parent.innerHTML = ''
      parent.appendChild(new_table)
    }

  },

  'links' : {

    'offercatalog' : {
      'json-service-link' : "Service Link",
      'json-keyword' : "Service Type"
    },

    'sameas' : {
      'json-sameas' : 'Social Link'
    },

    'same-as' : function (num_arg) {
      var container = document.createElement('div')

      for (var i = 0; i < num_arg; i++) {
        var wrapper = document.createElement('div')
        var input = document.createElement('input')
        var label = document.createElement('label')
        var text = document.createTextNode( 'Link ' + (i+1).toString() )
        var value = ( document.querySelector('#' + 'json-sameas-' + i.toString()) ) ?
          document.querySelector('#' + 'json-sameas-' + i.toString()).value : ''
        label.className = 'sameas-label'
        input.className = 'json-sameas'
        input.id = 'json-sameas-' + i.toString()
        input.value = value
        wrapper.className = 'flex-row flex-start'
        label.appendChild(text)
        label.appendChild(input)
        wrapper.appendChild(label)
        container.appendChild(wrapper)
      }
      return container
    },

    'offer-catalog' : function (num_arg) {
      var container = document.createElement('div')

      var input = {}
      var label = {}
      var text = {}

      for (var i = 0; i < num_arg; i++) {
        var row = document.createElement('div')
        row.className = 'flex-row flex-start json-offercatalog'
        Object.keys(app.links.offercatalog).forEach( (prop) => {
          var value = ( document.querySelector('#' + prop + '_' + i.toString()) ) ?
            document.querySelector('#' + prop + '_' + i.toString()).value : ''
          input = document.createElement('input')
          input.className = prop
          input.id = prop + '_' + i.toString()
          input.value = value
          label = document.createElement('label')
          label.className = prop + '-label'
          text = document.createTextNode(app.links.offercatalog[prop])
          label.appendChild(text)
          label.appendChild(input)
          row.appendChild(label)
        })
        container.appendChild(row)
      }
      return container
    },

    link_schema : function (num_arg,schema_prop) {
      var container = document.createElement('div')

      var input = {}
      var label = {}
      var text = {}

      for (var i = 0; i < num_arg; i++) {
        var row = document.createElement('div')
        row.className = 'flex-row flex-start ' + schema_prop
        Object.keys(app.links[schema_prop]).forEach( (prop) => {
          var value = ( document.querySelector('#' + prop + '_' + i.toString()) ) ?
            document.querySelector('#' + prop + '_' + i.toString()).value : ''
          input = document.createElement('input')
          input.className = prop
          input.id = prop + '_' + i.toString()
          label = document.createElement('label')
          label.className = prop + '-label'
          text = document.createTextNode(app.links.catalog_props[prop])
          label.appendChild(text)
          label.appendChild(input)
          row.appendChild(label)
        })
        container.appendChild(row)
      }
      return container
    }

  },
  read_form : function () {

  }

}


app.init(data.open_weekdays)
