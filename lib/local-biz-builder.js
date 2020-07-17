'use strict'

var dom = {

  field_counters : document.querySelectorAll('.field-counter'),

  text_fields : document.querySelectorAll('.json-text'),

  get_flex_fields : function () {
    this.link_fields = document.querySelectorAll('.json-link'),
    this.hour_fields = document.querySelectorAll('.json-hour')
    return {
      link_fields : this.link_fields,
      hour_fields : this.hour_fields
    }
  },


  fields : function () {
    var flex_fields = this.get_flex_fields()
    return [
      this.text_fields, this.link_fields, this.hour_fields
    ]
  }

}

var data = {
  text_schema : {},
  link_schema : {'sameas':[],'offercatalog':[]},
  hours_schema : {},
  open_weekdays : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  using_weekdays : []
}

var app = {

  init : function (weekdays) {
    this.info.populate_options(weekdays)

    dom.text_fields.forEach( (field) => {
      field.addEventListener( 'change', () => {
        app.read_form()
        console.log(field.id)
      })
    })

    dom.field_counters.forEach( (counter) => {
      counter.addEventListener( 'change', () => {
        //field_type = this.parentElement.id.replace(flex_field_slug,'')
        container = this.parentElement.querySelector('.flex-fields')
        fields = container.querySelectorAll('.flex-field')
      })
    })

  },

  'nap' : {

  },

  'info' : {

    populate_options : function (weekdays) {
      var select_weekday = document.querySelector('#select-weekday')
      weekdays.forEach( (day) => {
        var node = document.createTextNode(day)
        var el = document.createElement('option')
        el.appendChild(node)
        el.value = day
        select_weekday.appendChild(el)
      })
    }

  },

  'links' : {

  },
  read_form : function () {

    dom.text_fields.forEach( (field) => {
      data.text_schema[field.id] = field.value
    })


    console.log(text_schema)
  }

}


app.init(data.open_weekdays)
