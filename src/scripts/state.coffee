{ p } = require('./util')

module.exports =
class State
  onMouseMove: ->

  onFrame: (event) ->
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
    else if part.endCondition
      if part.endCondition()
        @_runNextInSequence event
      else
        part.action(event)

  _runNextInSequence: (event) ->
    @_sequenceIndex++
    if @_sequenceIndex >= @_sequence.length
      @_sequenceFinished = true
    else
      part = @_sequence[@_sequenceIndex]
      @_sequenceWaitTime = 0 if part.waitTime
      part.setup() if part.setup
      part.action(event)

  showText: (dot, text) ->
    @_textItem ?= @_setupText()
    @_textItem.opacity = 1.75
    @_textItem.content = text
    @_textItem.point = p(
      dot.bounds.center.x - (@_textItem.bounds.width / 2)
      dot.bounds.top - (@_textItem.bounds.height / 2)
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
