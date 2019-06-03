/*
  *	GamePad Controller Extension for USB 12-Button Wheel 
  *	in the tool environment Scratch, written in JavaScript language
  * by @arm923i https://t.me/arm923i
  * © 2019
*/

(function(ext) {

  /* var DEADZONE = 8000 / 32767;  */

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

  ext.gamepadSupport = (!!navigator.getGamepads ||
                        !!navigator.gamepads);
  ext.gamepad = null;

  ext.stickDirection = {left: 90, right: 90};

  ext.tick = function() {
    ext.gamepad = (navigator.getGamepads &&
                   navigator.getGamepads()[0]);
    window.requestAnimationFrame(ext.tick);
  };
  if (ext.gamepadSupport) window.requestAnimationFrame(ext.tick);

  ext._shutdown = function() {};

  ext._getStatus = function() {
    if (!ext.gamepadSupport) return {
      status: 1,
      msg: "Please use a recent version of Google Chrome",
    };

    if (!ext.gamepad) return {
      status: 1,
      msg: "Please plug in a gamepad and press any button",
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
      case "wheel":  
			x = ext.gamepad.axes[0]; 
			return x*110;	
			
      case "pedal": 
			x = -ext.gamepad.axes[1]; 
			return x*10;
    }
    /* 
		if (-DEADZONE < x && x < DEADZONE) x = 0;
		if (-DEADZONE < y && y < DEADZONE) y = 0;
		
		case "direction":
        if (x === 0 && y === 0) {
          // report the stick's previous direction
          return ext.stickDirection[stick];
        }
        var value = 180 * Math.atan2(x, y) / Math.PI;
        ext.stickDirection[stick] = value;
        return value;
		case "force": 
	*/
  };

  var descriptor = {
    blocks: [
      ["b", "Extension installed?", "installed"],
      ["b", "button %m.button pressed?", "getButton", "X"],
      ["r", "wheel direction", "getStick", "wheel"],
	  ["r", "pedal direction", "getStick", "pedal"],
    ],
    menus: {
      button: buttonMenu,
      /* stick: ["forward pedal","backwards pedal"], */
    },
  };

  ScratchExtensions.register("USB 12-Button Wheel", descriptor, ext);

})({});