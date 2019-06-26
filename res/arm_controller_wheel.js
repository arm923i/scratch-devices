/*  
  * Software Modules to support additional input devices in the tool environment Scratch.
  * Wheel Gamepad Controller Extension, written in JavaScript language 
  * ©2019 by @arm923i https://github.com/arm923i/ 
*/

(function(ext) {

  var buttons = [
    ["A", 0],
    ["B", 1],
    ["X", 2],
    ["Y", 3],
    ["Left petal", 4],
    ["Right petal", 5],
    ["Left bottom", 6],
    ["Right bottom", 7],
    ["Select", 8],
    ["Start", 9],
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

  ext.getButtonPressing = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad.buttons[index];
    return button.pressed;
  };

  ext.getStickState = function(stick) {
    var x;
    switch (stick) {
      case "Wheel": x = ext.gamepad.axes[0]; break;			
      case "Pedals": x = -ext.gamepad.axes[1]; break;
    }
	switch (stick) {
      case "Wheel": return x.toFixed(2)*90+90;			
      case "Pedals": return x.toFixed(2)*5;
    }
  };

  var descriptor = {
    blocks: [
      ["b", "modules installed?", "installed"],
      ["b", "button %m.button pressed", "getButtonPressing", "X"],
      ["r", "%m.stick direction", "getStickState", "Wheel"],
    ],
    menus: {
      button: buttonMenu,
      stick: ["Wheel","Pedals"],
    },
    url: 'https://arm923i.github.io/scratch-devices/'
  };

  ScratchExtensions.register("Wheel GamePad", descriptor, ext);

})({});