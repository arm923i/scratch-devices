/*
  *  GamePad Controller Extension for USB Twin GamePad
  *  in the tool environment Scratch, written in JavaScript language
  *  © 2019 by @arm923i https://t.me/arm923i
*/

(function(ext) {

  var haveEvents = 'GamepadEvent' in window;
  var haveWebkitEvents = 'WebKitGamepadEvent' in window;
  var controllers = {};
  var rAF = window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.requestAnimationFrame;

  var buttons = [
    ["A", 0],
    ["B", 1],
    ["X", 2],
    ["Y", 3],
    ["left top", 4],
    ["left bottom", 6],
    ["right top", 5],
    ["right bottom", 7],
    ["select", 8],
    ["start", 9],
    ["left stick", 10],
    ["right stick", 11],
  ];

  var buttonList = [];
  var buttonNames = {};

  buttons.forEach(function(d) {
    var name = d[0], index = d[1];
    buttonList.push(name);
    buttonNames[name] = index;
  });

    function connecthandler(e) {
        addgamepad(e.gamepad);
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
    }

    function addgamepad(e) {
        controllers[e.index] = e;
        console.log("add", e.index, e.id, e.buttons.length, e.axes.length);
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad);
        console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);
    }

    function removegamepad(e) {
        delete controllers[e.index];
    }

    function updateStatus() {
        haveEvents || scangamepads(), rAF(updateStatus)
    }

    function scangamepads() {
        for (var e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [], n = 0; n < e.length; n++) e[n] && (e[n].index in controllers ? controllers[e[n].index] = e[n] : addgamepad(e[n]))
    }

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}


  ext._shutdown = function() {};

  ext._getStatus = function() {

    return {
      status: 2,
      msg: "Good to go!",
    };
  };

  ext.installed = function() {
    return true;
  }

  ext.getButton_1 = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad.buttons[index];
    return button.pressed;
  };

  ext.getButton_2 = function(name) {
    var index = buttonNames[name];
    var button = ext.gamepad_2.buttons[index];
    return button.pressed;
  };

  ext.getStick_1 = function(what, stick) {
    var x, y;
    switch (stick) {
      case "left":  x = ext.gamepad.axes[0]; y = -ext.gamepad.axes[1]; break;
      case "right": x = ext.gamepad.axes[5]; y = -ext.gamepad.axes[2]; break;
    }
    switch (what) {
      case "direction":
        if (x === 0 && y === 0) {
          return ext.stickDirection_1[stick];
        }
        var value = (180 * Math.atan2(x, y) / Math.PI) + 135;
        ext.stickDirection_1[stick] = value;
        return value;
      case "forceX":
        return x*5;
      case "forceY":
        return y*5;
    }
  };

  ext.getStick_2 = function(what, stick) {
    var x, y;
    switch (stick) {
      case "left":  x = ext.gamepad_2.axes[0]; y = -ext.gamepad_2.axes[1]; break;
      case "right": x = ext.gamepad_2.axes[5]; y = -ext.gamepad_2.axes[2]; break;
    }
    switch (what) {
      case "direction":
        if (x === 0 && y === 0) {
          return ext.stickDirection_2[stick];
        }
        var value = (180 * Math.atan2(x, y) / Math.PI) + 135;
        ext.stickDirection_2[stick] = value;
        return value;
      case "forceX":
        return x*5;
      case "forceY":
        return y*5;
    }
  };

  var descriptor = {
    blocks: [
      ["b", "modules installed?", "installed"],
      ["b", "gp#1 button %m.button pressed", "getButton_1", "X"],
      ["b", "gp#2 button %m.button pressed", "getButton_2", "X"],
      ["r", "gp#1 %m.axisValue of %m.stick stick", "getStick_1", "direction", "left"],
      ["r", "gp#2 %m.axisValue of %m.stick stick", "getStick_2", "direction", "left"],
    ],
    menus: {
      button: buttonList,
      stick: ["left", "right"],
      axisValue: ["direction", "forceX", "forceY"],
    },
  };

  ScratchExtensions.register("Twin GamePad", descriptor, ext);

})({});