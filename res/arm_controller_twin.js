/*
  *	GamePad Controller Extension for USB Twin GamePad
  *	in the tool environment Scratch, written in JavaScript language
  * © 2019 by @arm923i https://t.me/arm923i
*/

(function(ext) {

  var DEADZONE = 8000 / 32767;
  
  var buttons = [
    ["left top", 4],
    ["left bottom", 6],
    ["right top", 5],
    ["right bottom", 7],
    ["left stick", 10],
    ["right stick", 11],
    ["A", 0],
    ["B", 1],
    ["X", 2],
    ["Y", 3],
    ["select", 8],
    ["start", 9],
    ["up", 12],
    ["down", 13],
    ["left", 14],
    ["right", 15],
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

  ext.gamepad_2 = null;

  ext.tick = function() {
    ext.gamepad   = (navigator.getGamepads && navigator.getGamepads()[0]);
    ext.gamepad_2 = (navigator.getGamepads && navigator.getGamepads()[1]);
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
      msg: "Plug in a first gamepad and press any button",
    };
    if (!ext.gamepad_2) return {
      status: 1,
      msg: "Plug in a second gamepad and press any button",
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

  ext.getButton_2 = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad_2.buttons[index];
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
      case "pedals": return x.toFixed(2)*5;
    }
  };
  ext.getStick_2 = function(what, stick) {
    var x, y;
    switch (stick) {
      case "left":  x = ext.gamepad_2.axes[0]; y = -ext.gamepad_2.axes[1]; break;
      case "right": x = ext.gamepad_2.axes[2]; y = -ext.gamepad_2.axes[3]; break;
    }
    if (-DEADZONE < x && x < DEADZONE) x = 0;
    if (-DEADZONE < y && y < DEADZONE) y = 0;

    switch (what) {
      case "direction":
        if (x === 0 && y === 0) {
          // report the stick's previous direction
          return ext.stickDirection[stick];
        }
        var value = 180 * Math.atan2(x, y) / Math.PI;
        ext.stickDirection[stick] = value;
        return value;
      case "force":
        return Math.sqrt(x*x + y*y) * 100;
    }
  };
  var descriptor = {
    blocks: [
      ["b", "modules installed?", "installed"],
      ["b", "gamepad #1 button %m.button pressed", "getButton", "X"],
      ["b", "gamepad #2 button %m.button pressed", "getButton_2", "X"],
      ["r", "gamepad #1 %m.axisValue of %m.stick stick", "getStick", "direction", "left"],
      ["r", "gamepad #2 %m.axisValue of %m.stick stick", "getStick_2", "direction", "left"],
    ],
    menus: {
      button: buttonMenu,
      stick: ["left", "right"],
      axisValue: ["direction", "force"],
    },
  };

  ScratchExtensions.register("Twin GamePad", descriptor, ext);

})({});
