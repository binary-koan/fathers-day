(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var InitialState, container, restartButton, setState, startButton, startPanel;

paper.install(window);

setState = require('./scripts/util').setState;

InitialState = require('./states/1');

container = document.querySelector('#container');

startPanel = document.querySelector('.banner.start');

startButton = document.querySelector('#start-button');

restartButton = document.querySelector('#restart-button');

startButton.addEventListener('click', function() {
  setState(new InitialState());
  startPanel.classList.add('hidden');
  return container.classList.remove('hidden');
});

restartButton.addEventListener('click', function() {
  return location.reload();
});

window.onload = function() {
  startButton.classList.remove('hidden');
  return paper.setup('container');
};


},{"./scripts/util":5,"./states/1":6}],2:[function(require,module,exports){
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


},{"./util":5}],3:[function(require,module,exports){
var MovingState, State, loadBackground, p, r, ref, s, setState,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require('../scripts/util'), setState = ref.setState, loadBackground = ref.loadBackground, p = ref.p, r = ref.r, s = ref.s;

State = require('../scripts/state');

module.exports = MovingState = (function(superClass) {
  extend(MovingState, superClass);

  function MovingState(obj) {
    MovingState.__super__.constructor.call(this, obj.imageId, obj.dotPosition);
    this._hoveredText = obj.hoveredText;
    this._nextState = obj.nextState;
    obj.path.unshift(obj.dotPosition);
    this._path = new Path(obj.path);
  }

  MovingState.prototype.onMouseMove = function(event) {
    if (this.dot.contains(event.point) && !this._hovered) {
      this._hovered = true;
      this.dot.setFace(':)');
      return this.showText(this._hoveredText);
    }
  };

  MovingState.prototype.sequence = function() {
    return [
      {
        endCondition: (function(_this) {
          return function() {
            return _this._hovered;
          };
        })(this),
        action: (function(_this) {
          return function(event) {
            if (!_this._initialX) {
              _this._initialX = _this.dot.position.x - Math.sin(event.time) * 10;
            }
            return _this.dot.position.x = _this._initialX + Math.sin(event.time) * 10;
          };
        })(this)
      }, {
        path: this._path
      }, {
        action: (function(_this) {
          return function() {
            return setState(new _this._nextState());
          };
        })(this)
      }
    ];
  };

  return MovingState;

})(State);


},{"../scripts/state":4,"../scripts/util":5}],4:[function(require,module,exports){
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
    this.dot.opacity = 0;
    this._transitionStep = 0;
  }

  State.prototype.onMouseMove = function() {};

  State.prototype.onFrame = function(event) {
    if (this._transitionStep === 0) {
      if (this.background.opacity < 1) {
        this.background.opacity += 0.05;
        return;
      } else {
        this.foreground.opacity = 1;
        this._transitionStep = 1;
      }
    } else if (this._transitionStep === 1) {
      if (this.dot.opacity < 1) {
        this.dot.opacity += 0.05;
        return;
      } else {
        this._transitionStep = 2;
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


},{"./dot":2,"./util":5}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
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
          return function() {};
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


},{"../scripts/dot":2,"../scripts/state":4,"../scripts/util":5,"./2":7}],7:[function(require,module,exports){
var MovingState, SecondState, ThirdState, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

p = require('../scripts/util').p;

MovingState = require('../scripts/moving-state');

ThirdState = require('./3');

module.exports = SecondState = (function(superClass) {
  extend(SecondState, superClass);

  function SecondState() {
    SecondState.__super__.constructor.call(this, {
      imageId: '2',
      dotPosition: p(230, 75),
      hoveredText: 'Too slow!',
      path: [p(300, 25), p(400, 50), p(300, 300)],
      nextState: ThirdState
    });
  }

  return SecondState;

})(MovingState);


},{"../scripts/moving-state":3,"../scripts/util":5,"./3":8}],8:[function(require,module,exports){
var FourthState, MovingState, ThirdState, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

p = require('../scripts/util').p;

MovingState = require('../scripts/moving-state');

FourthState = require('./4');

module.exports = ThirdState = (function(superClass) {
  extend(ThirdState, superClass);

  function ThirdState() {
    ThirdState.__super__.constructor.call(this, {
      imageId: '3',
      dotPosition: p(900, 250),
      hoveredText: 'Hah!',
      path: [p(500, 150), p(300, -50)],
      nextState: FourthState
    });
  }

  return ThirdState;

})(MovingState);


},{"../scripts/moving-state":3,"../scripts/util":5,"./4":9}],9:[function(require,module,exports){
var FifthState, FourthState, MovingState, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

p = require('../scripts/util').p;

MovingState = require('../scripts/moving-state');

FifthState = require('./5');

module.exports = FourthState = (function(superClass) {
  extend(FourthState, superClass);

  function FourthState() {
    FourthState.__super__.constructor.call(this, {
      imageId: '4',
      dotPosition: p(200, 590),
      hoveredText: "Aww ... guess I'm too fast!",
      path: [p(500, 300), p(-50, 100)],
      nextState: FifthState
    });
    this.dot.rotate(-10);
  }

  return FourthState;

})(MovingState);


},{"../scripts/moving-state":3,"../scripts/util":5,"./5":10}],10:[function(require,module,exports){
var FifthState, MovingState, SixthState, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

p = require('../scripts/util').p;

MovingState = require('../scripts/moving-state');

SixthState = require('./6');

module.exports = FifthState = (function(superClass) {
  extend(FifthState, superClass);

  function FifthState() {
    FifthState.__super__.constructor.call(this, {
      imageId: '5',
      dotPosition: p(930, 240),
      hoveredText: 'No! My camouflage!',
      path: [p(500, 300), p(100, 250)],
      nextState: SixthState
    });
  }

  return FifthState;

})(MovingState);


},{"../scripts/moving-state":3,"../scripts/util":5,"./6":11}],11:[function(require,module,exports){
var MovingState, SeventhState, SixthState, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

p = require('../scripts/util').p;

MovingState = require('../scripts/moving-state');

SeventhState = require('./7');

module.exports = SixthState = (function(superClass) {
  extend(SixthState, superClass);

  function SixthState() {
    SixthState.__super__.constructor.call(this, {
      imageId: '6',
      dotPosition: p(140, 250),
      hoveredText: 'That was close!',
      path: [p(500, 200), p(750, -50)],
      nextState: SeventhState
    });
  }

  return SixthState;

})(MovingState);


},{"../scripts/moving-state":3,"../scripts/util":5,"./7":12}],12:[function(require,module,exports){
var Dot, SeventhState, State, loadBackground, p, r, ref, s, setState,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require('../scripts/util'), setState = ref.setState, loadBackground = ref.loadBackground, p = ref.p, r = ref.r, s = ref.s;

State = require('../scripts/state');

Dot = require('../scripts/dot');

module.exports = SeventhState = (function(superClass) {
  extend(SeventhState, superClass);

  function SeventhState() {
    SeventhState.__super__.constructor.call(this, '7', p(485, 240));
  }

  SeventhState.prototype.onMouseMove = function(event) {
    if (this.dot.contains(event.point) && !this._hovered) {
      return this._hovered = true;
    }
  };

  SeventhState.prototype.sequence = function() {
    return [
      {
        endCondition: (function(_this) {
          return function() {
            return _this._hovered;
          };
        })(this),
        action: (function(_this) {
          return function(event) {
            return _this.dot.position.x = 500 + Math.sin(event.time) * 10;
          };
        })(this)
      }, {
        path: new Path([p(485, 240), p(485, 200)])
      }, {
        action: (function(_this) {
          return function() {
            return _this.showText('Aww ... you got me.');
          };
        })(this),
        waitTime: 3
      }, {
        action: (function(_this) {
          return function() {
            _this.dot.setFace(':)');
            return _this.showText('Thanks for playing!');
          };
        })(this),
        waitTime: 3
      }, {
        action: (function(_this) {
          return function() {
            return document.querySelector('.banner.end').classList.remove('hidden');
          };
        })(this)
      }
    ];
  };

  return SeventhState;

})(State);


},{"../scripts/dot":2,"../scripts/state":4,"../scripts/util":5}]},{},[1])


//# sourceMappingURL=script.js.map