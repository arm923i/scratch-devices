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

  ext.gamepadSupport = (!!navigator.getGamepads || !!navigator.gamepads);
 
  ext.gamepad = null;

  ext.stickDirection = {left: 90, right: 90};

  ext.tick = function() {
    ext.gamepad = (navigator.getGamepads && navigator.getGamepads()[0]);
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
  
  ext.getClick = function(name) {		
    var index = buttonNames[name];
    var button = ext.gamepad.buttons[index];
	var arm = button.pressed;
	if ( arm == true )
		return true;
	
  };

  ext.getStick = function(stick) {
    var x;
    switch (stick) {
      case "wheel": x = ext.gamepad.axes[0]; break;			
      case "pedal": x = -ext.gamepad.axes[1]; break;
    }
	switch (stick) {
      case "wheel": return x*90+90;			
      case "pedal": return x*10;
    }
  };

  var descriptor = {
    blocks: [
      ["b", "Extension installed?", "installed"],
      ["b", "button %m.button pressed ?", "getButton", "X"],
	  ["b", "button %m.button click ?", "getClick", "X"],
      ["r", "%m.stick direction", "getStick", "wheel"],
    ],
    menus: {
      button: buttonMenu,
      stick: ["wheel","pedal"],
    },
  };

  ScratchExtensions.register("USB 12-Button Wheel", descriptor, ext);

})({});