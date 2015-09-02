paper.install window

{ setState } = require('./scripts/util')
InitialState = require('./states/1')

window.onload = ->
  paper.setup 'container'
  setState(new InitialState())
