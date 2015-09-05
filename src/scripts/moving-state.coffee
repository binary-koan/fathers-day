{ setState, loadBackground, p, r, s } = require('../scripts/util')
State = require('../scripts/state')

module.exports =
class MovingState extends State
  constructor: (obj) ->
    super(obj.imageId, obj.dotPosition)
    @_hoveredText = obj.hoveredText
    @_nextState = obj.nextState
    obj.path.unshift(obj.dotPosition)
    @_path = new Path(obj.path)

  onMouseMove: (event) ->
    if @dot.contains(event.point) and not @_hovered
      @_hovered = true
      @dot.setFace ':)'
      @showText @_hoveredText

  sequence: -> [
    {
      endCondition: => @_hovered
      action: (event) =>
        unless @_initialX
          @_initialX = @dot.position.x - Math.sin(event.time) * 10
        @dot.position.x = @_initialX + Math.sin(event.time) * 10
    }
    {
      path: @_path
    }
    {
      action: =>
        setState(new (@_nextState)())
    }
  ]
