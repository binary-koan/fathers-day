paper = require('../bower_components/paper/dist/paper-full')
paper.install window

{ setState } = require('./scripts/util')
InitialState = require('./states/1')

container = document.querySelector('#container')
startPanel = document.querySelector('.banner.start')
startButton = document.querySelector('#start-button')
restartButton = document.querySelector('#restart-button')

startButton.addEventListener 'click', ->
  setState(new InitialState())
  startPanel.classList.add('hidden')
  container.classList.remove('hidden')

restartButton.addEventListener 'click', ->
  location.reload()

window.onload = ->
  startButton.classList.remove('hidden')
  paper.setup 'container'
