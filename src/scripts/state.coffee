{ loadBackground, p } = require('./util')
Dot = require('./dot')

module.exports =
class State
  constructor: (imageID, dotPosition) ->
    @background = loadBackground('background' + imageID)
    @foreground = loadBackground('foreground' + imageID)
    @dot = new Dot(dotPosition)
    @layer = new Layer([@background, @dot, @foreground])

    @background.opacity = 0
    @foreground.opacity = 0
    @dot.opacity = 0
    @_transitionStep = 0

  onMouseMove: ->

  onFrame: (event) ->
    if @_transitionStep == 0
      if @background.opacity < 1
        @background.opacity += 0.05
        return
      else
        @foreground.opacity = 1
        @_transitionStep = 1
    else if @_transitionStep == 1
      if @dot.opacity < 1
        @dot.opacity += 0.05
        return
      else
        @_transitionStep = 2

    if not @_sequenceIndex?
      @_sequence = @sequence()
      @_sequenceFinished = (@_sequence.length == 0)
      @_sequenceIndex = 0

    @_continueSequence(event)
    @_continueText() if @_showingText

  nextFrame: ->

  sequence: -> []

  _continueSequence: (event) ->
    part = @_sequence[@_sequenceIndex]
    if @_sequenceFinished
      @nextFrame(event)
    else if @_sequenceWaitTime?
      if @_sequenceWaitTime < part.waitTime
        @_sequenceWaitTime += event.delta
      else
        @_sequenceWaitTime = null
        @_runNextInSequence event
    else if part.path
      @_continuePath(part, event)
    else if part.endCondition
      if part.endCondition()
        @_runNextInSequence event
      else
        part.action(event)

  _continuePath: (part, event) ->
    @_offset += @_step
    if @_offset >= (part.path.length - @_step)
      @_runNextInSequence(event)

    @dot.position = part.path.getLocationAt(@_offset).point
    part.during(part.path, event) if part.during

  _runNextInSequence: (event) ->
    @_sequenceIndex++
    if @_sequenceIndex >= @_sequence.length
      @_sequenceFinished = true
    else
      part = @_sequence[@_sequenceIndex]
      if part.waitTime
        @_sequenceWaitTime = 0 if part.waitTime
      else if part.path
        @_setupPath(part)
      part.setup() if part.setup
      part.action(event) if part.action

  _setupPath: (part) ->
    part.path.smooth()
    @_offset = 0
    @_step = part.path.length / 30

  showText: (text) ->
    @_textItem ?= @_setupText()
    @_textItem.opacity = 1.75
    @_textItem.content = text
    @_textItem.point = p(
      @dot.bounds.center.x - (@_textItem.bounds.width / 2)
      @dot.bounds.top - (@_textItem.bounds.height / 2)
    )
    @_showingText = true

  _setupText: ->
    new PointText
      fillColor: 'white'
      fontFamily: 'sans-serif'
      fontWeight: 'bold'
      fontSize: 16
      shadowColor: 'black'
      shadowBlur: 2

  _continueText: ->
    if @_textItem.opacity == 0
      @_showingText = false
    else
      @_textItem.point.y -= 0.3
      @_textItem.opacity = Math.max(@_textItem.opacity - 0.015, 0)
