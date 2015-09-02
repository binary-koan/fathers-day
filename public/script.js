(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var InitialState, setState;

paper.install(window);

setState = require('./scripts/util').setState;

InitialState = require('./states/1');

window.onload = function() {
  paper.setup('container');
  return setState(new InitialState());
};


},{"./scripts/util":4,"./states/1":5}],2:[function(require,module,exports){
var Dot, s,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

s = require('./util').s;

module.exports = Dot = (function(superClass) {
  extend(Dot, superClass);

  function Dot(position) {
    this.circle = new Path.Circle({
      position: s(0, 0),
      radius: 30,
      fillColor: 'white'
    });
    this.face = new Raster({
      source: 'images/faces-01.png'
    });
    this.face.onLoad = (function(_this) {
      return function() {
        _this.face.scale(0.7);
        return _this.face.onLoad = null;
      };
    })(this);
    Dot.__super__.constructor.call(this, {
      children: [this.circle, this.face],
      position: position
    });
  }

  Dot.prototype.setFace = function(face) {
    switch (face) {
      case '':
        return this.face.source = null;
      case ':|':
        return this.face.source = 'images/faces-01.png';
      case ':)':
        return this.face.source = 'images/faces-02.png';
      case ';)':
        return this.face.source = 'images/faces-03.png';
    }
  };

  return Dot;

})(Group);


},{"./util":4}],3:[function(require,module,exports){
var Dot, State, loadBackground, p, ref;

ref = require('./util'), loadBackground = ref.loadBackground, p = ref.p;

Dot = require('./dot');

module.exports = State = (function() {
  function State(imageID, dotPosition) {
    this.background = loadBackground('background' + imageID);
    this.foreground = loadBackground('foreground' + imageID);
    this.dot = new Dot(dotPosition);
    this.layer = new Layer([this.background, this.dot, this.foreground]);
    this.background.opacity = 0;
    this.foreground.opacity = 0;
    this._transitioning = true;
  }

  State.prototype.onMouseMove = function() {};

  State.prototype.onFrame = function(event) {
    if (this._transitioning) {
      if (this.background.opacity < 1) {
        this.background.opacity += 0.05;
        return;
      } else {
        this.foreground.opacity = 1;
      }
    }
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
      return this.nextFrame(event);
    } else if (this._sequenceWaitTime != null) {
      if (this._sequenceWaitTime < part.waitTime) {
        return this._sequenceWaitTime += event.delta;
      } else {
        this._sequenceWaitTime = null;
        return this._runNextInSequence(event);
      }
    } else if (part.path) {
      return this._continuePath(part, event);
    } else if (part.endCondition) {
      if (part.endCondition()) {
        return this._runNextInSequence(event);
      } else {
        return part.action(event);
      }
    }
  };

  State.prototype._continuePath = function(part, event) {
    this._offset += this._step;
    if (this._offset >= (part.path.length - this._step)) {
      this._runNextInSequence(event);
    }
    this.dot.position = part.path.getLocationAt(this._offset).point;
    if (part.during) {
      return part.during(part.path, event);
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
        if (part.waitTime) {
          this._sequenceWaitTime = 0;
        }
      } else if (part.path) {
        this._setupPath(part);
      }
      if (part.setup) {
        part.setup();
      }
      if (part.action) {
        return part.action(event);
      }
    }
  };

  State.prototype._setupPath = function(part) {
    part.path.smooth();
    this._offset = 0;
    return this._step = part.path.length / 30;
  };

  State.prototype.showText = function(text) {
    if (this._textItem == null) {
      this._textItem = this._setupText();
    }
    this._textItem.opacity = 1.75;
    this._textItem.content = text;
    this._textItem.point = p(this.dot.bounds.center.x - (this._textItem.bounds.width / 2), this.dot.bounds.top - (this._textItem.bounds.height / 2));
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
      this._textItem.point.y -= 0.3;
      return this._textItem.opacity = Math.max(this._textItem.opacity - 0.015, 0);
    }
  };

  return State;

})();


},{"./dot":2,"./util":4}],4:[function(require,module,exports){
var loadBackground, p, r, s, setState;

window.mouseTool = new Tool();

exports.setState = setState = function(state) {
  view.onFrame = state.onFrame.bind(state);
  mouseTool.onMouseMove = state.onMouseMove.bind(state);
  return view.activeLayer = state.layer;
};

exports.loadBackground = loadBackground = function(source) {
  var image;
  image = new Raster(source, view.center);
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

exports.p = p = function() {
  return (function(func, args, ctor) {
    ctor.prototype = func.prototype;
    var child = new ctor, result = func.apply(child, args);
    return Object(result) === result ? result : child;
  })(Point, arguments, function(){});
};

exports.r = r = function() {
  return (function(func, args, ctor) {
    ctor.prototype = func.prototype;
    var child = new ctor, result = func.apply(child, args);
    return Object(result) === result ? result : child;
  })(Rectangle, arguments, function(){});
};

exports.s = s = function() {
  return (function(func, args, ctor) {
    ctor.prototype = func.prototype;
    var child = new ctor, result = func.apply(child, args);
    return Object(result) === result ? result : child;
  })(Size, arguments, function(){});
};


},{}],5:[function(require,module,exports){
var Dot, InitialState, SecondState, State, loadBackground, p, r, ref, s, setState,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require('../scripts/util'), setState = ref.setState, loadBackground = ref.loadBackground, p = ref.p, r = ref.r, s = ref.s;

State = require('../scripts/state');

Dot = require('../scripts/dot');

SecondState = require('./2');

module.exports = InitialState = (function(superClass) {
  extend(InitialState, superClass);

  function InitialState() {
    InitialState.__super__.constructor.call(this, '1', view.center);
    this.dot.opacity = 0;
    this.dot.scale(0.2);
    this.dot.bringToFront();
  }

  InitialState.prototype.onMouseMove = function(event) {
    if (this._sequenceFinished && this.dot.contains(event.point)) {
      this.showText('Wheeee!');
      return this._stateChanging = true;
    }
  };

  InitialState.prototype.sequence = function() {
    return [
      {
        action: (function(_this) {
          return function() {
            _this.dot.scale(1.15);
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
            return _this.showText('Hi!');
          };
        })(this),
        waitTime: 2
      }, {
        setup: (function(_this) {
          return function() {
            return _this.dot.setFace(':)');
          };
        })(this),
        action: (function(_this) {
          return function() {
            return _this.showText("I'm going on an adventure!");
          };
        })(this),
        waitTime: 2
      }, {
        setup: (function(_this) {
          return function() {
            return _this.dot.setFace(';)');
          };
        })(this),
        action: (function(_this) {
          return function() {
            return _this.showText('See if you can catch me!');
          };
        })(this),
        waitTime: 2
      }, {
        path: new Path([p(500, 300), p(700, 100), p(800, 200), p(750, 250)]),
        during: (function(_this) {
          return function(path) {
            if (Math.abs(_this._offset - (path.length / 2)) < _this._step / 2) {
              return _this.foreground.bringToFront();
            }
          };
        })(this)
      }
    ];
  };

  InitialState.prototype.nextFrame = function(event) {
    if (this._stateChanging) {
      if (this.dot.position.x > 900) {
        return setState(new SecondState());
      } else {
        return this.dot.position.x += 10;
      }
    } else {
      return this.dot.position.x = 750 + Math.sin(event.time) * 10;
    }
  };

  return InitialState;

})(State);


},{"../scripts/dot":2,"../scripts/state":3,"../scripts/util":4,"./2":6}],6:[function(require,module,exports){
var Dot, SecondState, State, loadBackground, p, r, ref, s,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require('../scripts/util'), loadBackground = ref.loadBackground, p = ref.p, r = ref.r, s = ref.s;

State = require('../scripts/state');

Dot = require('../scripts/dot');

module.exports = SecondState = (function(superClass) {
  extend(SecondState, superClass);

  function SecondState() {
    SecondState.__super__.constructor.call(this, '2', p(230, 75));
  }

  SecondState.prototype.onMouseMove = function(event) {
    if (this.dot.contains(event.point)) {
      this._hovered = true;
      return this.showText('Too slow!');
    }
  };

  SecondState.prototype.sequence = function() {
    return [
      {
        endCondition: (function(_this) {
          return function() {
            return _this._hovered;
          };
        })(this),
        action: (function(_this) {
          return function(event) {
            return _this.dot.position.x = 230 + Math.sin(event.time) * 10;
          };
        })(this)
      }, {
        path: new Path([p(230, 75), p(300, 25), p(400, 50), p(300, 300)])
      }
    ];
  };

  return SecondState;

})(State);


},{"../scripts/dot":2,"../scripts/state":3,"../scripts/util":4}]},{},[1])


//# sourceMappingURL=script.js.map