{ p } = require('../scripts/util')
MovingState = require('../scripts/moving-state')

ThirdState = require('./3')

module.exports =
class SecondState extends MovingState
  constructor: ->
    super
      imageId: '2'
      dotPosition: p(230, 75)
      hoveredText: 'Too slow!'
      path: [ p(300, 25), p(400, 50), p(300, 300) ]
      nextState: ThirdState
