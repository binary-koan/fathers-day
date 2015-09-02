paper.install window
paper.setup 'container'

loadBackground = (source) ->
  image = new Raster("images/#{source}", view.center)
  image.resizeToFill = ->
    image.position = view.center
    scale = Math.max(view.size.width / image.width, view.size.height / image.height)
    image.size = new Size(image.width * scale, image.height * scale)
  image.onLoad = ->
    image.resizeToFill()
  image

class Dot extends Group
  constructor: (position) ->
    @circle = new Path.Circle
      position: s(0, 0)
      radius: 45
      fillColor: 'white'
    @face = new Raster(source: 'images/faces-01.png', size: s(50, 50))
    super(children: [@circle, @face], position: view.center)

  setFace: (face) ->
    switch face
      when ''
        @face.source = null
      when ':|'
        @face.source = 'images/faces-01.png'
      when ':)'
        @face.source = 'images/faces-02.png'
      when ';)'
        @face.source = 'images/faces-03.png'

p = -> new Point(arguments...)
r = -> new Rectangle(arguments...)
s = -> new Size(arguments...)

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

class InitialState extends State
  constructor: ->
    super
    @background = loadBackground('1.jpg')
    @foreground = loadBackground('1-foreground.png')
    @dot = new Dot(view.center)
    @dot.opacity = 0
    @dot.scale(0.2)
    @layer = new Layer([@background, @foreground, @dot])

  onMouseMove: (event) ->
    if @_sequenceFinished && @dot.contains(event.point)
      alert('done!')

  sequence: -> [
    {
      action: =>
        @dot.scale 1.1
        @dot.opacity += 0.1
      endCondition: =>
        @dot.opacity >= 1
    }
    {
      action: => @showText(@dot, 'Hi!')
      waitTime: 2
    }
    {
      setup: => @dot.setFace(':)')
      action: => @showText(@dot, "I'm going on an adventure!")
      waitTime: 2
    }
    {
      setup: => @dot.setFace(';)')
      action: => @showText(@dot, 'See if you can catch me!')
      waitTime: 2
    }
    {
      setup: =>
        @_path = new Path([
          p(500, 300), p(700, 100), p(800, 200), p(750, 250)
        ])
        @_path.smooth()
        @_offset = 0
        @_step = @_path.length / 30
      action: =>
        @_offset += @_step
        @dot.position = @_path.getLocationAt(@_offset).point
        # console.log('step: ' + @_step + '; ' + @_path.length / 2)
        if Math.abs(@_offset - (@_path.length / 2)) < @_step / 2
          @foreground.bringToFront()
      endCondition: =>
        @_offset >= (@_path.length - @_step)
    }
  ]

  nextFrame: (event) ->
    @dot.position.x = 750 + Math.sin(event.time) * 10

mouseTool = new Tool()
setState = (state) ->
  view.onFrame = state.onFrame.bind(state)
  mouseTool.onMouseMove = state.onMouseMove.bind(state)
  view.activeLayer = state.layer

setState new InitialState()
