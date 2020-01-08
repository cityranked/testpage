/*
var nav = document.querySelector('nav')
var navkit = document.querySelector('.navkit')
//
navkit.addEventListener('click', () => {
  var nav_toggle_init = nav.getAttribute('toggle-init').split(',')
  console.log(nav_toggle_init)
  var props = nav.getAttribute('toggle-props').split(',')
  var index = props.indexOf(nav_toggle_init[1])
  var data = (index === props.length-1) ? props[0] : props[index+1]
    nav.setAttribute('toggle-init', nav_toggle_init[0] + ',' + data)
    console.log(index)
    console.log(data)
    console.log()
    nav.style[nav_toggle_init[0]] = data
})
*/
var dl = document.querySelector('dl')
var num_in = document.querySelector('#metaform').querySelector('input')
var form_data = []

num_in.addEventListener('change', function () {
  var len = (dl.querySelectorAll('dd')) ? dl.querySelectorAll('dd').length : 0
  var divs = []
  for (var i = 0; i < (Number(this.value) - len); i++) {
    dl.appendChild(
      wrap_fields( make_dt(len + i), make_dd(len + i) )
    )
  }
  if (Number(this.value) < len && Number(this.value) > -1) {
    for (var ii = this.value; ii < len; ii++) {
      divs = document.querySelector('dl').childNodes
      dl.removeChild(divs[divs.length-1])
    }
  }
})

function make_dt(num_arg) {
  var dt = document.createElement('dt')
  var hinge = document.createElement('span')
  var title = document.createElement('span')
  var hinge_node = document.createTextNode('- ')
  var title_node = document.createTextNode(num_arg.toString())
  hinge.className = "toggleHinge"
  title.className = "toggleTitle"
  hinge.appendChild(hinge_node)
  title.appendChild(title_node)
  dt.appendChild(hinge)
  dt.appendChild(title)
  return dt
}

function make_select(optionTextObj, iterator) {
  var select = document.createElement('select')
  var elm = {};
  var node = {};
  optionTextObj.vals.forEach( (e) => {
    elm = document.createElement('option')
    elm.setAttribute('value',e)
    node = document.createTextNode(
      optionTextObj.text[optionTextObj.vals.indexOf(e)]
    )
    elm.appendChild(node)
    select.appendChild(elm)
  })
  select.className = 'wyvern'
  select.id = 'operator_' + iterator.toString()
  if (form_data[iterator]) {
    select.value = form_data[iterator][0]
  }
  select.addEventListener('change', function () {
    if (!form_data[iterator]) {
      form_data[iterator] = []
    }
    form_data[iterator][0] = this.value
  })
  return select
}

function make_input(iterator, num_arg) {
  var this_in = document.createElement('input')
  this_in.id = 'term_' + iterator.toString() + '_' + num_arg.toString()
  this_in.className = 'goblin'
  this_in.setAttribute('type','number')
  if (form_data[iterator]) {
    this_in.value = form_data[iterator][num_arg]
  }
  this_in.addEventListener('change', function () {
    if (!form_data[iterator]) {
      form_data[iterator] = []
    }
    form_data[iterator][num_arg] = this.value
  })
  return this_in
}

function wrap_field(elm) {
  var div = document.createElement('div')
  div.className = 'flexOuter flexRow flexCenter'
  div.appendChild(elm)
  return div
}

function wrap_fields(elm1,elm2) {
  var div = document.createElement('div')
  div.className = 'flexOuter flexColumn flexBetween'
  div.appendChild(elm1)
  div.appendChild(elm2)
  return div
}

function make_dd(iterator) {
  var dd = document.createElement('dd')
  var form_elms = [
    wrap_field(make_input(iterator, 1)),
    wrap_field(make_select({
        vals:['add','sub','mul','div'],
        text:['Plus','Minus','Times','Divided by']
      }, iterator)
    ),
    wrap_field(make_input(iterator, 2))
  ]
  form_elms.forEach( (e) => {
    dd.appendChild(e)
  })
  return dd
}
