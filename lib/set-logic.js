'use strict'

function loadDeck(data) {
  //currently belongs to the anonymous global 'referee' object
  //note: this will make a set deck *from and with properly formatted data.*
  //I know there is a way to make a totally data agnostic--also randomizable--set,
  //I just haven't figured out how to write it yet.
  //the idea being--the deck shouldn't even know what game it's playing
  var deck = "["
  var index = 0
  var card = {
    shape : new String,
    color : new String,
    fill : new String,
    number : new String
  }
  for (let i = 0; i < data.shapes.length; i++) {
    for (let ii = 0; ii < data.colors.length; ii++) {
      for (let iii = 0; iii < data.fills.length; iii++) {
        for (let iv = 0; iv < data.numbers.length; iv++) {
          card.shape = data.shapes[i]
          card.color = data.colors[ii]
          card.fill = data.fills[iii]
          card.number = data.numbers[iv]
          card.status = "in_deck"
          card.id = index
          deck += (JSON.stringify(card) + ",")
          index++
        }
      }
    }
  }
  deck = deck.slice(0,deck.length-1)
  deck += "]"

  return deck
}

function isSet(card1, card2, card3) {
  //currently belongs to the anonymous global 'referee' object
  //two factors hard-coded into this test are the number of cards(3) and attributes(4)
  //I believe there is a data-agnostic, autmoatable, randomizable way to do this,
  //I just haven't figured out how to write it yet.
  //the idea being--the set test shouldn't even know what game it's playing
  var card1keys = Object.keys(card1)
  var card2keys = Object.keys(card2)
  var card3keys = Object.keys(card3)
  var results = new Array
  var count = 0
  var result = false
  for (let i = 0; i < card1keys.length; i++) {
    if
      ( //if no two attributes match . . .
        (
          (card1[card1keys[i]] != card2[card2keys[i]]) &&
          (card1[card1keys[i]] != card3[card3keys[i]]) &&
          (card2[card2keys[i]] != card3[card3keys[i]])
        ) ||
        ( //. . . or all three match
          (card1[card1keys[i]] === card2[card2keys[i]]) &&
          (card1[card1keys[i]] === card3[card3keys[i]]) &&
          (card2[card2keys[i]] === card3[card3keys[i]])
        )
      )
      {
       results[i] = true
      }
  }
  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      count++
    }
  }
  result = (count === 4) ? true : false
  return result
}

//this is the entire set deck hash
var attributes = {
  shapes: ["t", "e", "s"],
  colors: ["purple", "green", "red"],
  fills: ["none", "b", "i"],
  numbers: ["1","2","3"]
}
//the global objects
var setGame = new Object
//setGame dependencies: referee-functions
var setSession = new Object
//setSession dependencies:
var setDOM = new Object
//setDOM dependencies: setGame
var app = document.getElementById("app")
//app dependencies: <div id="app"></app>

//current game parameters - may expand this into session.params.table_area
var table_area = 12


//setGame - the cards and basic play flow
setGame.deck = JSON.parse(loadDeck(attributes))


setGame.state = function () {
  //sorts which cards are in play, in the deck, or in a set
  //returns an associative array with keynames as lists of cards by status
  var result = new Object
  var keys = new Array
  for (let i = 0; i < this.deck.length; i++) {
    keys = Object.keys(result)
    if (keys.indexOf(this.deck[i].status) != -1) {
      result[this.deck[i].status].push(this.deck[i])
    } else {
      result[this.deck[i].status] = new Array
      result[this.deck[i].status].push(this.deck[i])
    }

  }
  return result
}

setGame.setTable = function (int) {
  //regulates the number of cards in play at once - currently no limits -
  //will find what's in play and add-on what's needed - i.e., pre-filter this.
  var state = this.state()
  var result = state.in_play ? state.in_play : new Array
  var new_index = new Number
  if (state.in_deck.length) {
    for (let i = 0; i < int; i++) {
      state = this.state()
      new_index = Math.floor(Math.random() * state.in_deck.length)
      result.push(state.in_deck[new_index])
      this.deck[state.in_deck[new_index].id].status = "in_play"
    }
  }
  this.state()
  return result
}

setGame.replaceSet = function (int) {
  //setTable by 3s
  var result = this.setTable(int*3)
  return result
}

setGame.testForSet = function (ints) {
  var not_keys = ["status", "id"]
  var cards = "["
  var card_objs = new Array
  var card_obj = new Object
  var keys = new Array
  var result = false
  for (let i = 0; i < ints.length; i++) {
    keys = Object.keys(this.deck[ints[i]])
    console.log("card id: " + ints[i].toString())
    for (let ii = 0; ii < keys.length; ii++) {
      if (not_keys.indexOf(keys[ii]) === -1) {
        card_obj[keys[ii]] = new String
        card_obj[keys[ii]] = this.deck[ints[i]][keys[ii]]
        console.log("\t\t" + keys[ii] + " : " + card_obj[keys[ii]])
      }
    }
    cards += JSON.stringify(card_obj) + ","
  }
  cards = cards.slice(0, cards.length-1)
  cards += "]"
  card_objs = JSON.parse(cards)
  console.log(card_objs)
  result = isSet(card_objs[0],card_objs[1],card_objs[2])
  console.log("result: " + result)
  return result
}

//session controls players, scoring, and records sets
setSession.players = new Array

setSession.addPlayer = function (str) {
  //does what is sounds like it says it does
  var player = {
    name : str,
    id : this.players.length
  }
  this.players.push(player)
}
//will keep track of sets accumulated per player per game
setSession.setRecord = new Object
setSession.interval = 0

setDOM.HTMLdeck = new Array
setDOM.assemble = function (deck) {
  //transforms each set card's data-object into HTMl elements
  //returns them as an indexed array
  var elm = new Object
  var rel_shell = new Object;
  var unselect = new Object;
  var style_elm = new Object
  var text = new String
  var text_node = new Object
  var elements = new Array
  for (let i = 0; i < deck.length; i++) {
    text = new String
    elm = document.createElement("div")
    for (let ii = 0; ii < Number(deck[i].number); ii++) {
      text += deck[i].shape + " "
    }
    if (deck[i].fill != "none") {
      style_elm = document.createElement(deck[i].fill)
      text_node = document.createTextNode(text)
      style_elm.appendChild(text_node)
      elm.appendChild(style_elm)
    } else {
      text_node = document.createTextNode(text)
      elm.appendChild(text_node)
    }
    elm.id = deck[i].id
    elm.style.color = deck[i].color
    elm.className = "setCard"
    elm.addEventListener("click", function () {
      setDOM.initCardSelect(this.id)
    })
    elements.push(elm)
  }
  this.HTMLdeck = elements
}

setDOM.setSet = function (app, area) {
  //sets the game table - articulates DOM-game object with the app-shell
  var  display_tiles = new Array
  var data_table = setGame.setTable(area)
  var modals = document.getElementsByClassName("modal")
  var close_modals = document.getElementsByClassName("closeModal")
  for (let i = 0; i < data_table.length; i++) {
    display_tiles.push(this.HTMLdeck[data_table[i].id])
    app.appendChild(display_tiles[i])
  }
  for (var i = 0; i < modals.length; i++) {
    assignClick(close_modals[i], modals[i])
  }
  function assignClick(close_modal, modal) {
    close_modal.addEventListener("click", function () {
      modal.style.display = "none"
      app.blur()
    })
  }
}

setDOM.selectedCards = new Array

setDOM.initCardSelect = function (id_str) {
  var card_elm = document.getElementById(id_str)
  var set_test = false
  if (document.getElementById(id_str).className.indexOf("selected") === -1) {
    if (this.selectedCards.length >= 3) {
      console.log("can't select more than three cards")
      return false
    } else {
      document.getElementById(id_str).className += " selected"
      setDOM.selectedCards.push(Number(id_str))
      console.log("card " + id_str + " has been added to your set")
      console.log("current selected card ids:" + this.selectedCards)
    }
    if (this.selectedCards.length === 3) {
      console.log("testing for set")
      set_test = setGame.testForSet(this.selectedCards)
      if (set_test) {
        this.doModalContent("panel",[
          this.HTMLdeck[this.selectedCards[0]],
          this.HTMLdeck[this.selectedCards[1]],
          this.HTMLdeck[this.selectedCards[3]],
        ])
      }
    }
  } else {
    console.log("card is already selected--unselecting id: " +  id_str)
    card_elm.className = card_elm.className.replace(" selected","")
    this.selectedCards.splice(this.selectedCards.indexOf(Number(id_str)),1)
    console.log("current selected card ids:" + this.selectedCards)
  }
}

setDOM.doModalContent = function (id, data) {
  var modal = document.querySelector("#" + id)
  var shell = modal.querySelector(".flexOuterCenter")
  shell.innerHTML = ""
  shell.style.dislay = "block"
  for (let i = 0; i < data.length; i++) {
    shell.appendChild(data[i])
  }
}

//1) insert key - translate data model into HTML
setDOM.assemble(setGame.deck)
//2) turn key - 'set' the setDOM -
setDOM.setSet(app, table_area)
//--renders a custom-sized table of responsive cards on the page
/*
setDOM.doModalContent('panel', [
  setDOM.HTMLdeck[0],
  setDOM.HTMLdeck[1],
  setDOM.HTMLdeck[2]
])
*/

/*
//set-test test; change data in cards to test the test
var card1 = {
  shape : "diamond",
  color : "purple",
  fill : "none",
  number : "2"
}

var card2 = {
  shape : "diamond",
  color : "red",
  fill : "none",
  number : "2"
}

var card3 = {
  shape : "diamond",
  color : "green",
  fill : "none",
  number : "2"
}

var setTest = isSet(card1, card2, card3)
console.log(setTest)
*/