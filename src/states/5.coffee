{ p } = require('../scripts/util')
MovingState = require('../scripts/moving-state')

SixthState = require('./6')

module.exports =
class FifthState extends MovingState
  constructor: ->
    super
      imageId: '5'
      dotPosition: p(930, 240)
      hoveredText: 'No! My camouflage!'
      path: [ p(500, 300), p(100, 250) ]
      nextState: SixthState
