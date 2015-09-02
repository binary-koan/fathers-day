{ loadBackground, p, r, s } = require('../scripts/util')
State = require('../scripts/state')
Dot = require('../scripts/dot')

module.exports =
class SecondState extends State
  constructor: ->
    super('2', p(230, 75))

  onMouseMove: (event) ->
    if @dot.contains(event.point)
      @_hovered = true
      @showText 'Too slow!'

  sequence: -> [
    {
      endCondition: => @_hovered
      action: (event) =>
        @dot.position.x = 230 + Math.sin(event.time) * 10
    }
    {
      path: new Path([ p(230, 75), p(300, 25), p(400, 50), p(300, 300) ])
    }
  ]

  # onMouseMove: (event) ->
  #   if @_sequenceFinished && @dot.contains(event.point)
  #     alert('done!')
  #
  # sequence: -> [
  #   {
  #     action: =>
  #       @dot.scale 1.1
  #       @dot.opacity += 0.1
  #     endCondition: =>
  #       @dot.opacity >= 1
  #   }
  #   {
  #     action: => @showText(@dot, 'Hi!')
  #     waitTime: 2
  #   }
  #   {
  #     setup: => @dot.setFace(':)')
  #     action: => @showText(@dot, "I'm going on an adventure!")
  #     waitTime: 2
  #   }
  #   {
  #     setup: => @dot.setFace(';)')
  #     action: => @showText(@dot, 'See if you can catch me!')
  #     waitTime: 2
  #   }
  #   {
  #     setup: =>
  #       @_path = new Path([
  #         p(500, 300), p(700, 100), p(800, 200), p(750, 250)
  #       ])
  #       @_path.smooth()
  #       @_offset = 0
  #       @_step = @_path.length / 30
  #     action: =>
  #       @_offset += @_step
  #       @dot.position = @_path.getLocationAt(@_offset).point
  #       # console.log('step: ' + @_step + '; ' + @_path.length / 2)
  #       if Math.abs(@_offset - (@_path.length / 2)) < @_step / 2
  #         @foreground.bringToFront()
  #     endCondition: =>
  #       @_offset >= (@_path.length - @_step)
  #   }
  # ]
  #
  # nextFrame: (event) ->
  #   @dot.position.x = 750 + Math.sin(event.time) * 10
