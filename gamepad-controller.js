(function(ext) {

/*
 * Gamepad API Test
 * Written in 2019 by @arm923i
*/

var start;

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; 
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
  rAFStop(start);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
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

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

      ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
      };

      // ext.whenButtonPress = function() {
        
      //   if(navigator.webkitGetGamepads) {

      //     var gp = gamepads;
      //     if(gp.buttons[0] == 1) {
      //         b--;
      //       } else if(gp.buttons[1] == 1) {
      //         a++;
      //       } else if(gp.buttons[2] == 1) {
      //         b++;
      //       } else if(gp.buttons[3] == 1) {
      //         a--;
      //       }
      //     } else {

      //       var gp = gamepads;
      //       if(gp.buttons[0].value > 0 || gp.buttons[0].pressed == true) {
      //         b--;
      //       } else if(gp.buttons[1].value > 0 || gp.buttons[1].pressed == true) {
      //         a++;
      //       } else if(gp.buttons[2].value > 0 || gp.buttons[2].pressed == true) {
      //         b++;
      //       } else if(gp.buttons[3].value > 0 || gp.buttons[3].pressed == true) {
      //         a--;
      //       }
      //     }
      // };

  // Block and block menu descriptions

    var descriptor = {
    blocks: [
      ['h', 'when %m.btns pressed', 'whenButtonPress', 'btn1'],
      ['-'],
      ['h', 'when %m.axes move', 'whenAxesPress', 'axes1'],
    ],  
    menus: {
      btns: ['btn1', 'btn2', 'btn3', 'btn4'],
      axes: ['axes1', 'axes2'],
    
    },  
    url: 'https://arm923i.github.io/gamepad-scratch-extension/'
  };

  // Register the extension
  ScratchExtensions.register('Gamepad extension', descriptor, ext);

})({});