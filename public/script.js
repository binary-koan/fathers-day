var InitialState, State, loadBackground, setState,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

loadBackground = function(source) {
  var image;
  image = new Raster("images/" + source, view.center);
  image.resizeToFill = function() {
    var scale;
    image.position = view.center;
    scale = Math.max(view.size.width / image.width, view.size.height / image.height);
    return image.size = new Size(image.width * scale, image.height * scale);
  };
  image.onLoad = function() {
    return image.resizeToFill();
  };
  return image;
};

State = (function() {
  function State() {}

  State.prototype.onFrame = function(event) {
    if (this._sequenceIndex == null) {
      this._sequence = this.sequence();
      this._sequenceFinished = this._sequence.length === 0;
      this._sequenceIndex = 0;
    }
    this._continueSequence(event);
    if (this._showingText) {
      return this._continueText();
    }
  };

  State.prototype.nextFrame = function() {};

  State.prototype.sequence = function() {
    return [];
  };

  State.prototype._continueSequence = function(event) {
    var part;
    part = this._sequence[this._sequenceIndex];
    if (this._sequenceFinished) {
      return this.nextFrame();
    } else if (this._sequenceWaitTime != null) {
      if (this._sequenceWaitTime < part.waitTime) {
        return this._sequenceWaitTime += event.delta;
      } else {
        this._sequenceWaitTime = null;
        return this._runNextInSequence(event);
      }
    } else if (part.endCondition) {
      if (part.endCondition()) {
        return this._runNextInSequence(event);
      } else {
        return part.action();
      }
    }
  };

  State.prototype._runNextInSequence = function(event) {
    var part;
    this._sequenceIndex++;
    if (this._sequenceIndex >= this._sequence.length) {
      return this._sequenceFinished = true;
    } else {
      part = this._sequence[this._sequenceIndex];
      if (part.waitTime) {
        this._sequenceWaitTime = 0;
      }
      if (part.setup) {
        part.setup();
      }
      return part.action();
    }
  };

  State.prototype.showText = function(dot, text) {
    if (this._textItem == null) {
      this._textItem = this._setupText();
    }
    this._textItem.opacity = 1.5;
    this._textItem.content = text;
    this._textItem.point = new Point(dot.bounds.center.x - (this._textItem.bounds.width / 2), dot.bounds.top - (this._textItem.bounds.height / 2));
    return this._showingText = true;
  };

  State.prototype._setupText = function() {
    return new PointText({
      fillColor: 'white',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      fontSize: 16,
      shadowColor: 'black',
      shadowBlur: 2
    });
  };

  State.prototype._continueText = function() {
    if (this._textItem.opacity === 0) {
      return this._showingText = false;
    } else {
      this._textItem.point.y -= 0.5;
      return this._textItem.opacity = Math.max(this._textItem.opacity - 0.015, 0);
    }
  };

  return State;

})();

InitialState = (function(superClass) {
  extend(InitialState, superClass);

  function InitialState() {
    InitialState.__super__.constructor.apply(this, arguments);
    this.image = loadBackground('1.jpg');
    this.dot = new Path.Circle({
      center: view.center,
      radius: 10,
      fillColor: 'white',
      opacity: 0
    });
    this.dotSize = new Rectangle(view.center.x, view.center.y, 0, 0);
    this.layer = new Layer([this.image, this.dot]);
  }

  InitialState.prototype.sequence = function() {
    return [
      {
        action: (function(_this) {
          return function() {
            _this.dot.scale(1.1);
            return _this.dot.opacity += 0.1;
          };
        })(this),
        endCondition: (function(_this) {
          return function() {
            return _this.dot.opacity >= 1;
          };
        })(this)
      }, {
        action: (function(_this) {
          return function() {
            return _this.showText(_this.dot, 'Hi!');
          };
        })(this),
        waitTime: 2
      }, {
        action: (function(_this) {
          return function() {
            return _this.showText(_this.dot, "I'm going on an adventure!");
          };
        })(this),
        waitTime: 2
      }, {
        action: (function(_this) {
          return function() {
            return _this.showText(_this.dot, 'See if you can follow me!');
          };
        })(this),
        waitTime: 2
      }, {
        setup: (function(_this) {
          return function() {
            _this._path = new Path([new Point(500, 300), new Point(700, 100), new Point(800, 200)]);
            _this._offset = 0;
            return _this._step = _this._path.length / 100;
          };
        })(this),
        action: (function(_this) {
          return function() {
            _this._offset += _this._step;
            _this.dot.position = _this._path.getLocationAt(_this._offset).point;
            console.log(_this._offset);
            return console.log(_this.dot.position);
          };
        })(this),
        endCondition: (function(_this) {
          return function() {
            return _this._offset >= (_this._path.length - _this._step);
          };
        })(this)
      }
    ];
  };

  return InitialState;

})(State);

setState = function(state) {
  view.onFrame = state.onFrame.bind(state);
  return view.activeLayer = state.layer;
};

window.onload = function() {
  paper.install(window);
  paper.setup('container');
  return setState(new InitialState());
};
