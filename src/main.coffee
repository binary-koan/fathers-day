paper.install window

{ setState } = require('./scripts/util')
InitialState = require('./states/1')

container = document.querySelector('#container')
startPanel = document.querySelector('.banner.start')
startButton = document.querySelector('#start-button')

startButton.addEventListener 'click', ->
  setState(new InitialState())
  startPanel.classList.add('hidden')
  container.classList.remove('hidden')

window.onload = ->
  startButton.classList.remove('hidden')
  paper.setup 'container'
