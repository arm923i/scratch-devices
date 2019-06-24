
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

    ext.getInfo = function() {
		return controllers[0].id;
	};

    
    ext.stickDirection = {left: 90, right: 90};

    var dz = 8000 / 32767; // Deadzone

     ext.getButton = function(device, name) {
     	var devices = parseInt(device)-1;
	    var index = buttonNames[name];
	    var button = controllers[devices].buttons[index];
	    return button.pressed;
	  };

     ext.getStick = function(stick, what) {
	    var x, y;
	    switch (stick) {
	      case 'Left':  x = controllers[0].axes[0]; y = -controllers[0].axes[1]; break;
	      case 'Right': x = controllers[0].axes[5]; y = -controllers[0].axes[2]; break;
	    }
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
    
    ext.getStickAF = function(stick,af) {
        var xp, yp;
        switch (stick) {
            case 'Left': x = controllers[0].axes[0]; y = -controllers[0].axes[1]; break;
            case 'Right': x = controllers[0].axes[5]; y = -controllers[0].axes[2]; break;
        }
        if (-dz < x && x < dz) x = 0;
        if (-dz < y && y < dz) y = 0;
        switch(af) {
            case 'Angle': return(value = 180 * Math.atan2(x, y) / Math.PI); break;
            case 'Force': return Math.sqrt(x*x + y*y).toFixed(2); break;
        }
    };

    ext.getStickPos = function(s, hv) {
        return (controllers[0].axes[(['LeftHorizontal', 'LeftVertical', 'RightHorizontal', '', '', 'RightVertical'].indexOf(s + hv))].toFixed(2)); 
    };

    ext.getStickDirection = function(s, hvb) { 
        let output = '';
        if (s == 'Left') {
            if (hvb == 'Both' || hvb == 'Vertical') {
                if (controllers[0].axes[1] < -.5) {
                    output += 'Up '
                } else if (controllers[0].axes[1] > .5) {
                    output += 'Down '
                }
            }
            if (hvb == 'Both' || hvb == 'Horizontal') {
                if (controllers[0].axes[0] < -.5) {
                    output += 'Left'
                } else if (controllers[0].axes[0] > .5) {
                    output += 'Right'
                }
            }
        };
        if (s == 'Right') {
            if (hvb == 'Both' || hvb == 'Vertical') {
                if (controllers[0].axes[5] < -.5) {
                    output += 'Up '
                } else if (controllers[0].axes[5] > .5) {
                    output += 'Down '
                }
            }
            if (hvb == 'Both' || hvb == 'Horizontal') {
                if (controllers[0].axes[2] < -.5) {
                    output += 'Left'
                } else if (controllers[0].axes[2] > .5) {
                    output += 'Right'
                }
            }
        };
        return (output);
    };

    ext.getStickFacing = function(s, dir) {
        if (s == 'Left') {
            if (dir == 'Up') {
                return (controllers[0].axes[1] < -.5)
            }
            if (dir == 'Down') {
                return (controllers[0].axes[1] > .5)
            }
            if (dir == 'Left') {
                return (controllers[0].axes[0] < -.5)
            }
            if (dir == 'Right') {
                return (controllers[0].axes[0] > .5)
            }
            if (dir == 'Up Left') {
                return (controllers[0].axes[1] < -.5 && (controllers[0].axes[0] < -.5))
            }
            if (dir == 'Up Right') {
                return (controllers[0].axes[1] < -.5 && (controllers[0].axes[0] > .5))
            }
            if (dir == 'Down Left') {
                return (controllers[0].axes[1] > .5 && (controllers[0].axes[0] < -.5))
            }
            if (dir == 'Down Right') {
                return (controllers[0].axes[1] > .5 && (controllers[0].axes[0] > .5))
            }
        }
        if (s == 'Left') {
            if (dir == 'Up') {
                return (controllers[0].axes[5] < -.5)
            }
            if (dir == 'Down') {
                return (controllers[0].axes[5] > .5)
            }
            if (dir == 'Left') {
                return (controllers[0].axes[2] < -.5)
            }
            if (dir == 'Right') {
                return (controllers[0].axes[2] > .5)
            }
            if (dir == 'Up Left') {
                return (controllers[0].axes[5] < -.5 && (controllers[0].axes[2] < -.5))
            }
            if (dir == 'Up Right') {
                return (controllers[0].axes[5] < -.5 && (controllers[0].axes[2] > .5))
            }
            if (dir == 'Down Left') {
                return (controllers[0].axes[5] > .5 && (controllers[0].axes[2] < -.5))
            }
            if (dir == 'Down Right') {
                return (controllers[0].axes[5] > .5 && (controllers[0].axes[2] > .5))
            }
        }
    };

    var descriptor = {
		blocks: [
			['r', 'device id %m.devices', 'getInfo'],
			['-'],
			['h', 'When button %m.buttons pressed', 		'getButton', 	'X'],
			['b', 'GP# %m.devices button %m.buttons pressed', 'getButton', '1',	'X'],
			['-'],
			['r', '%m.sticks stick %m.hv position', 		'getStickPos', 			'Left', 'Horizontal'],
			['r', '%m.sticks stick %m.hvb direction', 		'getStickDirection', 	'Left', 'Both'],
			['-'],
			['h', 'When %m.sticks stick is facing %m.dir', 	'getStickFacing', 		'Left', 'Up'],
			['b', '%m.sticks stick is facing %m.dir?', 		'getStickFacing', 		'Left', 'Up'], 
			['-'],  
			['r', '%m.sticks stick %m.aefe', 				'getStickAF',	'Left', 'Angle'],   
			['r', '%m.sticks stick %m.axisValue', 			'getStick',		'Left', 'Direction']
		],
		menus: {
			devices: 	controllerList,
			buttons: 	buttonList,
			sticks: 	['Left', 'Right'],
			axisValue: 	['Direction', 'ForceX', 'ForceY'],
			hv: 		['Horizontal', 'Vertical'],
			hvb: 		['Horizontal', 'Vertical', 'Both'],
			dir: 		['Up', 'Down', 'Left', 'Right', 'Up Left', 'Up Right', 'Down Left', 'Down Right'],
			aefe: 		['Angle', 'Force']
		},
		url: 'https://arm923i.github.io/scratch-devices/',
		displayName: '@arm923i Gamepad'
    };

    ScratchExtensions.register('@arm923i Gamepad', descriptor, ext);
})({});