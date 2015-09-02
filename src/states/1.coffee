{ setState, loadBackground, p, r, s } = require('../scripts/util')
State = require('../scripts/state')
Dot = require('../scripts/dot')

SecondState = require('./2')

module.exports =
class InitialState extends State
  constructor: ->
    super('1', view.center)
    @dot.opacity = 0
    @dot.scale(0.2)
    @dot.bringToFront()

  onMouseMove: (event) ->
    if @_sequenceFinished && @dot.contains(event.point)
      @showText 'Wheeee!'
      @_stateChanging = true

  sequence: -> [
    {
      action: =>
        @dot.scale 1.15
        @dot.opacity += 0.1
      endCondition: =>
        @dot.opacity >= 1
    }
    {
      action: => @showText 'Hi!'
      waitTime: 2
    }
    {
      setup: => @dot.setFace(':)')
      action: => @showText "I'm going on an adventure!"
      waitTime: 2
    }
    {
      setup: => @dot.setFace(';)')
      action: => @showText 'See if you can catch me!'
      waitTime: 2
    }
    {
      path: new Path([ p(500, 300), p(700, 100), p(800, 200), p(750, 250) ])
      during: (path) =>
        if Math.abs(@_offset - (path.length / 2)) < @_step / 2
          @foreground.bringToFront()
    }
  ]

  nextFrame: (event) ->
    if @_stateChanging
      if @dot.position.x > 900
        setState(new SecondState())
      else
        @dot.position.x += 10
    else
      @dot.position.x = 750 + Math.sin(event.time) * 10
