loadBackground = (source) ->
  image = new Raster("images/#{source}", view.center)
  image.resizeToFill = ->
    image.position = view.center
    scale = Math.max(view.size.width / image.width, view.size.height / image.height)
    image.size = new Size(image.width * scale, image.height * scale)
  image.onLoad = ->
    image.resizeToFill()
  image

class State
  onFrame: (event) ->
    if not this._sequenceIndex?
      this._sequence = this.sequence()
      this._sequenceFinished = (this._sequence.length == 0)
      this._sequenceIndex = 0

    this._continueSequence(event)
    this._continueText() if this._showingText

  nextFrame: ->

  sequence: -> []

  _continueSequence: (event) ->
    part = this._sequence[this._sequenceIndex]
    if this._sequenceFinished
      this.nextFrame()
    else if this._sequenceWaitTime?
      if this._sequenceWaitTime < part.waitTime
        this._sequenceWaitTime += event.delta
      else
        this._sequenceWaitTime = null
        this._runNextInSequence event
    else if part.endCondition
      if part.endCondition()
        this._runNextInSequence event
      else
        part.action()

  _runNextInSequence: (event) ->
    this._sequenceIndex++
    if this._sequenceIndex >= this._sequence.length
      this._sequenceFinished = true
    else
      part = this._sequence[this._sequenceIndex]
      this._sequenceWaitTime = 0 if part.waitTime
      part.setup() if part.setup
      part.action()

  showText: (dot, text) ->
    this._textItem ?= this._setupText()
    this._textItem.opacity = 1.5
    this._textItem.content = text
    this._textItem.point = new Point(
      dot.bounds.center.x - (this._textItem.bounds.width / 2)
      dot.bounds.top - (this._textItem.bounds.height / 2)
    )
    this._showingText = true

  _setupText: ->
    new PointText
      fillColor: 'white'
      fontFamily: 'sans-serif'
      fontWeight: 'bold'
      fontSize: 16
      shadowColor: 'black'
      shadowBlur: 2

  _continueText: ->
    if this._textItem.opacity == 0
      this._showingText = false
    else
      this._textItem.point.y -= 0.5
      this._textItem.opacity = Math.max(this._textItem.opacity - 0.015, 0)

class InitialState extends State
  constructor: ->
    super
    this.image = loadBackground('1.jpg')
    this.dot = new Path.Circle
      center: view.center
      radius: 10
      fillColor: 'white'
      opacity: 0
    this.dotSize = new Rectangle(view.center.x, view.center.y, 0, 0)
    this.layer = new Layer([this.image, this.dot])

  sequence: -> [
    {
      action: =>
        this.dot.scale 1.1
        this.dot.opacity += 0.1
      endCondition: =>
        this.dot.opacity >= 1
    }
    {
      action: => this.showText(this.dot, 'Hi!')
      waitTime: 2
    }
    {
      action: => this.showText(this.dot, "I'm going on an adventure!")
      waitTime: 2
    }
    {
      action: => this.showText(this.dot, 'See if you can follow me!')
      waitTime: 2
    }
    {
      setup: =>
        this._path = new Path([
          new Point(500, 300), new Point(700, 100), new Point(800, 200)
        ])
        this._offset = 0
        this._step = this._path.length / 100
      action: =>
        this._offset += this._step
        this.dot.position = this._path.getLocationAt(this._offset).point
        console.log(this._offset)
        console.log(this.dot.position)
      endCondition: =>
        this._offset >= (this._path.length - this._step)
    }
  ]

setState = (state) ->
  view.onFrame = state.onFrame.bind(state)
  view.activeLayer = state.layer

# Only run our code once the DOM is ready.
window.onload = ->
  # Set up paper.js
  paper.install window
  paper.setup 'container'

  setState new InitialState()
