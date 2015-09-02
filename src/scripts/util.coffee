window.mouseTool = new Tool()
exports.setState =
setState = (state) ->
  view.onFrame = state.onFrame.bind(state)
  mouseTool.onMouseMove = state.onMouseMove.bind(state)
  view.activeLayer = state.layer

exports.loadBackground =
loadBackground = (source) ->
  image = new Raster("images/#{source}", view.center)
  image.resizeToFill = ->
    image.position = view.center
    scale = Math.max(view.size.width / image.width, view.size.height / image.height)
    image.size = new Size(image.width * scale, image.height * scale)
  image.onLoad = ->
    image.resizeToFill()
  image

exports.p =
p = -> new Point(arguments...)

exports.r =
r = -> new Rectangle(arguments...)

exports.s =
s = -> new Size(arguments...)
