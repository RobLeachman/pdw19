//TODO: which of these are still relevant?!
const Constant = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
  INTERACT: 4,

  NOTHING: 0,
  THING: 1,
  GAS: 2,

  // actions a bot can request of a location
  DO_RESTBOT: 1,
  DO_TAKESTUFF: 2,
  DO_UPGRADE: 3,
  DO_PUTSTUFF: 4,
  DO_DISPATCH: 5,

  swipeMaxTime: 1000,
  swipeMinDistance: 20,
  swipeMinNormal: 0.85
};

export default Constant;