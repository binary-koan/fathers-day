{ p } = require('../scripts/util')
MovingState = require('../scripts/moving-state')

FifthState = require('./5')

module.exports =
class FourthState extends MovingState
  constructor: ->
    super
      imageId: '4'
      dotPosition: p(200, 590)
      hoveredText: "Aww ... guess I'm too fast!"
      path: [ p(500, 300), p(-50, 100) ]
      nextState: FifthState
    @dot.rotate(-15)
