{ s } = require('./util')

module.exports =
class Dot extends Group
  constructor: (position) ->
    @circle = new Path.Circle
      position: s(0, 0)
      radius: 30
      fillColor: 'white'
    @face = new Raster(source: 'images/faces-01.png')
    @face.onLoad = =>
      @face.scale(0.7)
      @face.onLoad = null
    super(children: [@circle, @face], position: position)

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
