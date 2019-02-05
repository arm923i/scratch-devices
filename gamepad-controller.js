(function(ext) {

/*
 * Gamepad API Test
 * Written in 2019 by arm923i
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
  gameLoop();
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

function gameLoop() {

  if(navigator.webkitGetGamepads) {
    
    var gp = gamepads;
    if(gp.buttons[0] == 1) {
        b--;
      } else if(gp.buttons[1] == 1) {
        a++;
      } else if(gp.buttons[2] == 1) {
        b++;
      } else if(gp.buttons[3] == 1) {
        a--;
      }
    } else {

      var gp = gamepads;
      if(gp.buttons[0].value > 0 || gp.buttons[0].pressed == true) {
        b--;
      } else if(gp.buttons[1].value > 0 || gp.buttons[1].pressed == true) {
        a++;
      } else if(gp.buttons[2].value > 0 || gp.buttons[2].pressed == true) {
        b++;
      } else if(gp.buttons[3].value > 0 || gp.buttons[3].pressed == true) {
        a--;
      }
    }

  ball.style.left = a*2 + "px";
  ball.style.top = b*2 + "px";

  var start = rAF(gameLoop);
};

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



  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      ['R', '%m.reporterData in %s', 'getWeather', 'temperature', 'Boston, MA'],
      ['h', 'when %m.eventData in %s is %m.ops %n', 'whenWeather', 'temperature', 'Boston, MA', '>', 80],
      [' ', 'set units to %m.units', 'setUnits', 'imperial'],
      ['r', 'unit format', 'getUnits']
    ],
    menus: {
      reporterData: ['temperature', 'weather', 'humidity', 'wind speed', 'cloudiness'],
      eventData: ['temperature', 'humidity', 'wind speed', 'cloudiness'],
      ops: ['>','=', '<'],
      units: ['imperial', 'metric']
    }
  };

  // Register the extension
  ScratchExtensions.register('Weather extension', descriptor, ext);

})({});