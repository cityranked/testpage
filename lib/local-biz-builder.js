'use strict'

var dom = {

  json_form : document.querySelector('#local-biz-json-builder'),

  field_counters : document.querySelectorAll('.field-counter'),

  text_fields : document.querySelectorAll('.json-text'),

  submit_button : document.querySelector('#print-json'),

  select_weekday : document.querySelector('#select-weekday'),

  modal : document.querySelector('#json-viewer'),

  close_modal : document.querySelector('#close-json-viewer'),

  json_container : document.querySelector('#json-container'),

  click_headers : document.querySelectorAll('.local-biz-header')

}

var data = {
  schema_props : {'text':'text','link':['sameas','offercatalog'],'hours':'weekday'},
  text_schema : {},
  text_props : [
    "name",
    "streetAddress",
    "addressLocality",
    "addressRegion",
    "postalCode",
    "telephone",
    "website",
    "logo"
  ],
  link_schema : {'sameas':[],'offercatalog':[]},
  hours_schema : {},
  open_weekdays : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  using_weekdays : [],
}

var app = {

  focus_click : null,

  init : function (weekdays,categories) {

    this.info.populate_options(weekdays,'#select-weekday')

    this.info.populate_options(categories,'#select-type')

    dom.select_weekday.addEventListener( 'change', function () {
      app.focus_click = true
      if (app.focus_click) {
      //  console.log('selected:')
      //  console.log(this.value)
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
        // Dynamic function calls based on module's ID
        var new_table = app.links[type](this.value)

        parent.innerHTML = ''
        parent.appendChild(new_table)
        console.log(this.id)
        console.log(this.value)

      })
    }),

    dom.submit_button.addEventListener('click',app.submit_form)
    dom.close_modal.addEventListener('click',function () {
      dom.modal.style.display = 'none'
      dom.submit_button.style.display = 'block'
      dom.json_form.style.display = 'block'
      dom.json_form.style.opacity = '1'

    })

    dom.click_headers.forEach( (click_header) => {
      click_header.addEventListener( 'click', function () {
        var wrapper = this.nextElementSibling.querySelector('section')
        var toggle_vals = wrapper.getAttribute('datadisp').split(',')
        var toggle_opac = wrapper.getAttribute('dataopac')
        var new_opac = app.toggle_opacity(toggle_opac,wrapper,toggle_vals[0])

        toggle_vals.reverse()
        wrapper.setAttribute('datadisp',toggle_vals.join())
        wrapper.setAttribute('dataopac',new_opac)
      })
    })

  },

  toggle_opacity : function (val,el,disp) {

    function fade_out() {
      if (val < 0.05) {
        el.style.opacity = 0
        clearInterval(interval)
        el.style.display = disp
      } else {
        val = (val * 100-1)/100
        el.style.opacity = val
      }
    }

    function fade_in() {
      if (val > 0.95) {
        el.style.opacity = 1
        clearInterval(interval)
      } else {
        val = (val * 100+1)/100
        el.style.opacity = val
      }
    }

    var result, interval
    val = Number(val)
    if (val) {
      interval = setInterval(fade_out, 5)
      result = 0
    } else {
      el.style.display = disp
      interval = setInterval(fade_in,5)
      result = 1
    }

    return result
  },

  'validate_offercatalog' : function () {
    var props = ['url','name']
    var fields = {}
    var field_names =  Object.keys(app.links.offercatalog)
    var name = document.querySelector('#service-primary').value
    var url = document.querySelector('#website').value
    var catalog_obj = {
      "@type":"OfferCatalog",
      "name":name,
      "url":url,
      "itemListElement":[]
    }

    if (name && url) {
      console.log('got name & url')
      for (var i = 0; i < field_names.length; i++) {
        fields[ props[i] ] = document.querySelectorAll('.' + field_names[i])
      }

      for (var i = 0; i < fields['name'].length; i++) {
        var list_item = {
          "@type":"Offer",
          "itemOffered": {
             "@type":"Service"
          }
        }
        props.forEach( (prop) => {
          if (fields[prop][i].value) {
            list_item.itemOffered[prop] = fields[prop][i].value
          }
        })
        if (Object.keys(list_item.itemOffered).length===3) {
          catalog_obj.itemListElement.push(list_item)
        }

      }///ends for loop
    } else {
      console.log('no name or url found')
    }
    return (catalog_obj.itemListElement.length) ? catalog_obj : null
  },

  'validate_sameas' : function () {
    var result = []
    var fields = document.querySelectorAll('.json-sameas')
    fields.forEach( (field) => {
      if (field.value) {
        result.push(field.value)
      }
    })
    return result

  },

  validate_weekday : function (hours_keys,hours_table,day_labels,hours_props,i) {
    var day_obj = {
      "@type": "OpeningHoursSpecification"
    }
    var data_obj = {}
    var valid_row = 0

    hours_keys.forEach( (hours_key) => {
      data_obj[hours_key] = (hours_table[hours_key][i]) ?
       hours_table[hours_key][i].value : null
      valid_row += (data_obj[hours_key]) ? 1 : 0
    })

    if (valid_row === hours_keys.length && day_labels[i].innerText) {
      day_obj['dayOfWeek'] = [day_labels[i].innerText]

      hours_props.forEach( (op) => {
        var prop = op + 's'
        var hour = (data_obj[op + '-mode']==='PM') ?
          Number(data_obj[op + '-hour']) + 12 : Number(data_obj[op + '-hour'])
        hour = (hour < 10) ? '0' + hour.toString() : hour.toString()
        hour += ':' + data_obj[op + '-min'].toString()
        day_obj[prop] = hour
      })
      return day_obj
    } else {
      return null
    }
  },

  submit_form : function () {
    var schema_obj = {
      "@context": "https://schema.org"
    }
    var text_fields = document.querySelectorAll('.json-text')
    var hours_keys = Object.keys(app.info.row)
    var hours_table = []
    var hours_props = ['open','close']
    var day_labels = document.querySelectorAll('.day-label')
    var schema_prop_assoc = {
      'sameas' : 'sameAs',
      'offercatalog' : 'hasOfferCatalog'
    }
    // plain text namespsace
    for (var i = 0; i < text_fields.length;i++) {
      schema_obj[data.text_props[i]] = text_fields[i].value
    }
    // hours namespace
    hours_keys.forEach( (hours_key) => {
      hours_table[hours_key] = document.querySelectorAll('.' + hours_key)
    })
    if (day_labels.length) {
      schema_obj["OpeningHoursSpecification"] = []
      for ( var i = 0; i < day_labels.length; i++ ) {

        var day_obj = app.validate_weekday(hours_keys,hours_table,day_labels,hours_props,i)

        if (day_obj) {
          schema_obj["OpeningHoursSpecification"].push(day_obj)
        }
      }
    }
    // links namespace
    Object.keys(data.link_schema).forEach( (prop) => {
      var call_name = 'validate_' + prop
      var link_schema_obj = app[call_name]()
      schema_obj[schema_prop_assoc[prop]] = link_schema_obj
    })
    dom.modal.style.display = 'block'
    var json = document.createTextNode(JSON.stringify(schema_obj,null,10))
    dom.json_container.innerHTML = ''
    dom.json_container.appendChild(json)
    dom.submit_button.style.display = 'none'
    //dom.json_form.style.display = 'none'
    dom.json_form.style.opacity = '0.10'

    dom.json_container.focus()
    console.log(schema_obj)
  },

  'nap' : {

  },

  'info' : {
    categories : ["LocalBusiness"],
    week: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    row : {'open-hour': 'Open:','open-min':'','open-mode':'','close-hour':'Close:','close-min':'','close-mode':''},
    mode : ['AM','PM'],
    min : ['00','15','30','45'],

    populate_options : function (options,parent_id) {
      var parent = document.querySelector(parent_id)
      var class_slug = parent_id.replace('#select-','')
      parent.innerHTML = ''
      options.forEach( (option) => {
        var node = document.createTextNode(option)
        var el = document.createElement('option')
        el.appendChild(node)
        el.value = option
        el.className = class_slug + '-option'
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
      var str_arg = 'offercatalog'
      var input = {}
      var label = {}
      var text = {}

      for (var i = 0; i < num_arg; i++) {
        var row = document.createElement('div')
        row.className = 'flex-row flex-start json-' + str_arg
        Object.keys(app.links.offercatalog).forEach( (prop) => {

          var selector = '#' + prop + '_' + i.toString()

          var value = ( document.querySelector(selector) ) ?
            document.querySelector(selector).value :
              ( data.link_schema[str_arg][prop] ) ?
                data.link_schema[str_arg][prop][i] : ''
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
    }
  }
}

app.init(data.open_weekdays,app.info.categories)
