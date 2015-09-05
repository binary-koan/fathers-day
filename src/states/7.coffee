{ setState, loadBackground, p, r, s } = require('../scripts/util')
State = require('../scripts/state')
Dot = require('../scripts/dot')

module.exports =
class SeventhState extends State
  constructor: ->
    super('7', p(485, 240))

  onMouseMove: (event) ->
    if @dot.contains(event.point) and not @_hovered
      @_hovered = true

  sequence: -> [
    {
      endCondition: => @_hovered
      action: (event) =>
        @dot.position.x = 500 + Math.sin(event.time) * 10
    }
    {
      path: new Path([ p(485, 240), p(485, 200) ])
    }
    {
      action: =>
        @showText 'Aww ... you got me.'
      waitTime: 3
    }
    {
      action: =>
        @dot.setFace ':)'
        @showText 'Thanks for playing!'
      waitTime: 3
    }
    {
      action: =>
        document.querySelector('.banner.end').classList.remove('hidden')
    }
  ]
