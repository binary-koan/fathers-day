{ setState, loadBackground, p, r, s } = require('../scripts/util')
State = require('../scripts/state')
Dot = require('../scripts/dot')

module.exports =
class SeventhState extends State
  constructor: ->
    super('7', p(485, 240))

  onMouseMove: (event) ->
    if @dot.contains(event.point)
      @_hovered = true
      @showText 'Too slow!'

  sequence: -> [
    {
      endCondition: => @_hovered
      action: (event) =>
        @dot.position.x = 500 + Math.sin(event.time) * 10
    }
    {
      path: new Path([ p(230, 75), p(300, 25), p(400, 50), p(300, 300) ])
    }
  ]
