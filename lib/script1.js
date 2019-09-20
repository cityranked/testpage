'use strict'

var link_obj = {
  'arundel' : arundel,
  'baltimore' : baltimore,
  'buffalo' : buffalo,
  'pittsburgh' : pittsburgh,
  'reading' : reading
}

var links = document.querySelectorAll('a')

links.forEach( (e) => {
  e.addEventListener('click', () => {
    var property = e.childNodes[0].textContent
    var count = link_obj[property].length
    var this_index = Math.floor(Math.random() * count)
    e.href = link_obj[property][this_index]

  })
})
