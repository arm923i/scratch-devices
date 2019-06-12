/*
  *	GamePad Controller Extension for USB Twin GamePad
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
    ext.gamepad = (navigator.getGamepads && navigator.getGamepads()[1]);
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
      msg: "Plug in a twin gamepad and press any button",
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
  
  ext.getStick = function(what, stick) {
    var x, y;
    switch (stick) {
      case "left":  x = ext.gamepad.axes[0]; y = -ext.gamepad.axes[1]; break;
      case "right": x = ext.gamepad.axes[2]; y = -ext.gamepad.axes[3]; break;
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
      ["b", "button %m.button pressed", "getButton", "X"],
      ["r", "%m.axisValue of %m.stick stick", "getStick", "direction", "left"],
    ],
    menus: {
      button: buttonMenu,
      stick: ["left", "right"],
      axisValue: ["direction", "force"],
    },
  };

  ScratchExtensions.register("Twin GamePad", descriptor, ext);

})({});