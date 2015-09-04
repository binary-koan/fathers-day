{ p } = require('../scripts/util')
MovingState = require('../scripts/moving-state')

FourthState = require('./4')

module.exports =
class ThirdState extends MovingState
  constructor: ->
    super
      imageId: '3'
      dotPosition: p(900, 250)
      hoveredText: 'Hah!'
      path: [ p(500, 150), p(300, -50) ]
      nextState: FourthState
