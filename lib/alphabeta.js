'use strict'

var lis = document.querySelectorAll('.alphitem')
lis.forEach( (li) => {
  li.addEventListener( 'click', function () {
    if (this.getAttribute('toggle-color')==='white') {
      this.style.color = this.id
      this.setAttribute('toggle-color',this.id)
    } else {
      this.style.color = 'white'
      this.setAttribute('toggle-color','white')
    }
  })
})
