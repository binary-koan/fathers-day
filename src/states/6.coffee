{ p } = require('../scripts/util')
MovingState = require('../scripts/moving-state')

SeventhState = require('./7')

module.exports =
class SixthState extends MovingState
  constructor: ->
    super
      imageId: '6'
      dotPosition: p(140, 250)
      hoveredText: 'That was close!'
      path: [ p(500, 200), p(750, -50) ]
      nextState: SeventhState
