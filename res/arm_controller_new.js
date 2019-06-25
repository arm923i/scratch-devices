/*  
  * Software Modules to support additional input devices in the tool environment Scratch
  * GamePads Controller Extension, written in JavaScript language 
  * ©2019 by @arm923i https://github.com/arm923i/ 
*/

(function(ext) {

    ext._shutdown = function() {};

    var haveEvents = 'ongamepadconnected' in window,
        controllers = {},
        controllerList = [];

    var buttons = [
   	   ['A', 0],
       ['B', 1],
       ['X', 2],
       ['Y', 3],
       ['left top', 4],
       ['left bottom', 6],
       ['right top', 5],
       ['right bottom', 7],
       ['select', 8],
       ['start', 9],
       ['left stick', 10],
       ['right stick', 11]
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
    }

    function addgamepad(e) {
        controllers[e.index] = e;
        controllerList[e.index] = e.index+1;
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad);
    }

    function removegamepad(e) {
        delete controllers[e.index];
        delete controllerList[e.index];
    }

    function updateStatus() {
        haveEvents || scangamepads(), requestAnimationFrame(updateStatus);
    }

    function scangamepads() {
        for (var e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [], n = 0; n < e.length; n++) e[n] && (e[n].index in controllers ? controllers[e[n].index] = e[n] : addgamepad(e[n]));
    }
    window.addEventListener('gamepadconnected', connecthandler), window.addEventListener('gamepaddisconnected', disconnecthandler), haveEvents || setInterval(scangamepads, 1);
   
    ext._getStatus = function() {
        return {
            status: 2,
            msg: 'Ready'
        };
    };

    ext.getInfo = function(indx) {
        var indxs = parseInt(indx)-1;
		return controllers[indxs].id;
	};

    ext.stickDirection = { left: 90, right: 90 };

    var dz = 8000 / 32767; // Deadzone

     ext.getButtonPressing = function(indx, name) {
     	var indxs = parseInt(indx)-1;
	    var index = buttonNames[name];
	    var button = controllers[indxs].buttons[index];
	    return button.pressed;
	  };

     ext.getStickState = function(indx, stick, what) {
     	var indxs = parseInt(indx)-1;
	    var x, y;
	    switch (stick) {
	      case 'Left':  x = controllers[indxs].axes[0]; y = -controllers[indxs].axes[1]; break;
	      case 'Right': x = controllers[indxs].axes[5]; y = -controllers[indxs].axes[2]; break;
	    }
	    if (-dz < x && x < dz) x = 0;
        if (-dz < y && y < dz) y = 0;
	    switch (what) {
	      case 'Direction': 
	      	var value = (180 * Math.atan2(x, y) / Math.PI) + 135; 
	      	ext.stickDirection[stick] = value;
	        return value.toFixed(2);
	      break;
	      case 'ForceX': return x.toFixed(2)*5; break;
	      case 'ForceY': return y.toFixed(2)*5; break;
	    }
	  };
    
    ext.getStickState_2 = function(indx, stick, af) {
    	var indxs = parseInt(indx)-1;
        var x, y;
        switch (stick) {
            case 'Left': x = controllers[indxs].axes[0]; y = -controllers[indxs].axes[1]; break;
            case 'Right': x = controllers[indxs].axes[2]; y = -controllers[indxs].axes[5]; break;
        }
        if (-dz < x && x < dz) x = 0;
        if (-dz < y && y < dz) y = 0;
        switch(af) {
            case 'Angle': return(value = 180 * Math.atan2(x, y) / Math.PI); break;
            case 'Force': return Math.sqrt(x*x + y*y).toFixed(2); break;
        }
    };

    ext.getStickPosition = function(indx, s, hv) {
    	var indxs = parseInt(indx)-1;
        return (controllers[indxs].axes[(['LeftHorizontal', 'LeftVertical', 'RightHorizontal', '', '', 'RightVertical'].indexOf(s + hv))].toFixed(2)); 
    };

    ext.getStickDirection = function(indx, s, hvb) { 
    	var indxs = parseInt(indx)-1;
        let output = '';
        if (s == 'Left') {
            if (hvb == 'XY' || hvb == 'Y') {
                if (controllers[indxs].axes[1] < -.5) {
                    output += 'Up '
                } else if (controllers[indxs].axes[1] > .5) {
                    output += 'Down '
                }
            }
            if (hvb == 'XY' || hvb == 'X') {
                if (controllers[indxs].axes[0] < -.5) {
                    output += 'Left'
                } else if (controllers[indxs].axes[0] > .5) {
                    output += 'Right'
                }
            }
        };
        if (s == 'Right') {
            if (hvb == 'XY' || hvb == 'Y') {
                if (controllers[indxs].axes[5] < -.5) {
                    output += 'Up '
                } else if (controllers[indxs].axes[5] > .5) {
                    output += 'Down '
                }
            }
            if (hvb == 'XY' || hvb == 'X') {
                if (controllers[indxs0].axes[2] < -.5) {
                    output += 'Left'
                } else if (controllers[indxs].axes[2] > .5) {
                    output += 'Right'
                }
            }
        };
        return (output);
    };

    ext.getStickFacing = function(indx, s, dir) {
    	var indxs = parseInt(indx)-1;
        if (s == 'Left') {
            if (dir == 'Up') {
                return (controllers[indxs].axes[1] < -.5)
            }
            if (dir == 'Down') {
                return (controllers[indxs].axes[1] > .5)
            }
            if (dir == 'Left') {
                return (controllers[indxs].axes[0] < -.5)
            }
            if (dir == 'Right') {
                return (controllers[indxs].axes[0] > .5)
            }
            if (dir == 'UpLeft') {
                return (controllers[indxs].axes[1] < -.5 && (controllers[indxs].axes[0] < -.5))
            }
            if (dir == 'UpRight') {
                return (controllers[indxs].axes[1] < -.5 && (controllers[indxs].axes[0] > .5))
            }
            if (dir == 'DownLeft') {
                return (controllers[indxs].axes[1] > .5 && (controllers[indxs].axes[0] < -.5))
            }
            if (dir == 'DownRight') {
                return (controllers[indxs].axes[1] > .5 && (controllers[indxs].axes[0] > .5))
            }
        }
        if (s == 'Right') {
            if (dir == 'Up') {
                return (controllers[indxs].axes[5] < -.5)
            }indxs
            if (dir == 'Down') {
                return (controllers[indxs].axes[5] > .5)
            }
            if (dir == 'Left') {
                return (controllers[indxs].axes[2] < -.5)
            }
            if (dir == 'Right') {
                return (controllers[indxs].axes[2] > .5)
            }
            if (dir == 'UpLeft') {
                return (controllers[indxs].axes[5] < -.5 && (controllers[indxs].axes[2] < -.5))
            }
            if (dir == 'UpRight') {
                return (controllers[indxs].axes[5] < -.5 && (controllers[indxs].axes[2] > .5))
            }
            if (dir == 'DownLeft') {
                return (controllers[indxs].axes[5] > .5 && (controllers[indxs].axes[2] < -.5))
            }
            if (dir == 'DownRight') {
                return (controllers[indxs].axes[5] > .5 && (controllers[indxs].axes[2] > .5))
            }
        }
    };

    var descriptor = {
		blocks: [
			['r', 'GamePad (GP)# %m.devices id', 'getInfo', '1'],
			['-'],
			['h', 'When GP# %m.devices button %m.buttons pressed', 	'getButtonPressing', '1', 'X'],
			['b', 'GP# %m.devices button %m.buttons pressed',        'getButtonPressing', '1',	'X'],
			['-'],
			['r', 'GP# %m.devices %m.sticks stick %m.hv position', 	 'getStickPosition',  '1', 'Left', 'X'],
			['r', 'GP# %m.devices %m.sticks stick %m.hvb direction', 'getStickDirection', '1', 	'Left', 'Both'],
			['-'],
			['h', 'When GP# %m.devices %m.sticks stick is facing %m.dir', 	'getStickFacing', '1', 	'Left', 'Up'],
			['b', 'GP# %m.devices %m.sticks stick is facing %m.dir?',	    'getStickFacing', '1',	'Left', 'Up'], 
			['-'],  
			['r', 'GP# %m.devices %m.sticks stick %m.aefe',	     'getStickState_2', '1',	'Left', 'Angle'],   
			['r', 'GP# %m.devices %m.sticks stick %m.axisValue', 'getStickState', '1',	'Left', 'Direction']
		],
		menus: {
			devices: 	controllerList,
			buttons: 	buttonList,
			sticks: 	['Left', 'Right'],
			axisValue: 	['Direction', 'ForceX', 'ForceY'],
			hv: 		['X', 'Y'],
			hvb: 		['X', 'Y', 'XY'],
			dir: 		['Up', 'Down', 'Left', 'Right', 'UpLeft', 'UpRight', 'DownLeft', 'DownRight'],
			aefe: 		['Angle', 'Force']
		},
		url: 'https://arm923i.github.io/scratch-devices/',
		displayName: '@arm923i Gamepad'
    };

    ScratchExtensions.register('@arm923i Gamepad', descriptor, ext);
})({});