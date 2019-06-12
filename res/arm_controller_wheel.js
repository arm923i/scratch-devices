/*
  *	GamePad Controller Extension for USB 12-Button Wheel GamePad
  *	in the tool environment Scratch, written in JavaScript language
  * © 2019 by @arm923i https://t.me/arm923i
*/

(function(ext) {

  var buttons = [
    ["A", 0],
    ["B", 1],
    ["X", 2],
    ["Y", 3],
    ["left petal", 4],
    ["right petal", 5],
    ["left bottom", 6],
    ["right bottom", 7],
    ["select", 8],
    ["start", 9],
  ];

  var buttonMenu = [];
  var buttonNames = {};
  
  buttons.forEach(function(d) {
    var name = d[0],
        index = d[1];
    buttonMenu.push(name);
    buttonNames[name] = index;
  });

  ext.gamepadSupport = (!!navigator.getGamepads || !!navigator.gamepads);
 
  ext.gamepad = null;

  ext.tick = function() {
    ext.gamepad = (navigator.getGamepads && navigator.getGamepads()[0]);
    window.requestAnimationFrame(ext.tick);
  };
  
  if (ext.gamepadSupport) window.requestAnimationFrame(ext.tick);

  ext._shutdown = function() {};

  ext._getStatus = function() {
    if (!ext.gamepadSupport) return {
      status: 1,
      msg: "GamePad not supported",
    };
    if (!ext.gamepad) return {
      status: 1,
      msg: "Plug in a wheel gamepad and press any button",
    };
    return {
      status: 2,
      msg: "Good to go!",
    };
  };

  ext.installed = function() {
    return true;
  }

  ext.getButton = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad.buttons[index];
    return button.pressed;
  };

  ext.getStick = function(stick) {
    var x;
    switch (stick) {
      case "wheel": x = ext.gamepad.axes[0]; break;			
      case "pedals": x = -ext.gamepad.axes[1]; break;
    }
	switch (stick) {
      case "wheel": return x.toFixed(2)*90+90;			
      case "pedals": return x.toFixed(2)*10;
    }
  };

  var descriptor = {
    blocks: [
      ["b", "modules installed?", "installed"],
      ["b", "button %m.button pressed", "getButton", "X"],
      ["r", "%m.stick direction", "getStick", "wheel"],
    ],
    menus: {
      button: buttonMenu,
      stick: ["wheel","pedals"],
    },
  };

  ScratchExtensions.register("Wheel GamePad", descriptor, ext);

})({});