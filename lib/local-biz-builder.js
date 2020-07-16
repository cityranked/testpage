'use strict'

var json_text_fields = document.querySelectorAll('.json_text')
var field_counters = document.querySelectorAll('.field_counter')
var select_weekday = document.querySelector('#select-weekday')
var text_schema = {}
var link_schema = {'sameas':[],'offercatalog':[]}
var flex_field_slug = '_link_builder'
var ops_hours_schema = {}
var weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

populate_options(select_weekday,weekdays);

function populate_options(select_weekday,weekdays) {
  weekdays.forEach( (day) => {
    var node = document.createTextNode(day)
    var el = document.createElement('option')
    el.appendChild(node)
    el.value = day
    select_weekday.appendChild(el)
  })
}



field_counters.forEach( (counter) => {
  counter.addEventListener( 'change', () => {
    field_type = this.parentElement.id.replace(flex_field_slug,'')
    container = this.parentElement.querySelector('.flex-fields')
    fields = container.querySelectorAll('.flex-field')
    val = Number(this.value)
    if (fields.length) {
      fields.forEach()
    }

  })
})

json_text_fields.forEach( (field) => {
  text_schema[field.id] = field.value
})
