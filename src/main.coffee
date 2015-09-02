paper.install window
paper.setup 'container'

{ setState } = require('./scripts/util')
InitialState = require('./states/1')

setState(new InitialState())
