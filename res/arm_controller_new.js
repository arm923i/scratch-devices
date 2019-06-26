/*  
  * Software Modules to support additional input devices in the tool environment Scratch.
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
       ['Left Top', 4],
       ['Left Bottom', 6],
       ['Right Top', 5],
       ['Right Bottom', 7],
       ['Select', 8],
       ['Start', 9],
       ['Left Stick', 10],
       ['Right Stick', 11]
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
	    if (controllers.length == 0) return {
	      status: 1,
	      msg: "Plug in a device and press any button",
	    };
	    if (controllers == {}) return {
	      status: 1,
	      msg: "Plug in a device and press any button1",
	    };        	
        return {
            status: 2,
            msg: 'Ready'
        };
    };

    ext.getInfo = function(indx) {
        var indxs = parseInt(indx)-1;
		return controllers[indxs].id;
	};

	// Deadzone 
    var dz = 8000 / 32767; 

	ext.getButtonPressing = function(indx, name) {
		var indxs = parseInt(indx)-1, 
			index = buttonNames[name],
			button = controllers[indxs].buttons[index];
		return button.pressed;
	};
    
    ext.getStickState = function(indx, stick, what) {
    	var indxs = parseInt(indx)-1, x, y;
        switch (stick) {
            case 'Left': x = controllers[indxs].axes[0]; y = -controllers[indxs].axes[1]; break;
            case 'Right': x = controllers[indxs].axes[2]; y = -controllers[indxs].axes[5]; break;
        }
        if (-dz < x && x < dz) x = 0;
        if (-dz < y && y < dz) y = 0;
        switch(what) {
            case 'Angle': return(value = 180 * Math.atan2(x, y) / Math.PI); break;
            case 'Force': return Math.sqrt(x*x + y*y).toFixed(2); break;
            case 'ForceX': return x.toFixed(2); break;
	      	case 'ForceY': return y.toFixed(2); break;
        }
    };

    ext.getStickPosition = function(indx, stick, hv) {
    	var indxs = parseInt(indx)-1;
        return (controllers[indxs].axes[(['LeftHorizontal', 'LeftVertical', 'RightHorizontal', '', '', 'RightVertical'].indexOf(stick + hv))].toFixed(2)); 
    };

    ext.getStickDirection = function(indx, stick, hvb) { 
    	var indxs = parseInt(indx)-1; let output = '';
        if (stick == 'Left') {
            if (hvb == 'Both' || hvb == 'Vertical') {
                if (controllers[indxs].axes[1] < -.5) { output += 'Up ' } 
                else if (controllers[indxs].axes[1] > .5) { output += 'Down ' }
            }
            if (hvb == 'Both' || hvb == 'Horizontal') {
                if (controllers[indxs].axes[0] < -.5) { output += 'Left' } 
                else if (controllers[indxs].axes[0] > .5) { output += 'Right' }
            }
        };
        if (stick == 'Right') {
            if (hvb == 'Both' || hvb == 'Vertical') {
                if (controllers[indxs].axes[5] < -.5) { output += 'Up ' } 
                else if (controllers[indxs].axes[5] > .5) { output += 'Down ' }
            }
            if (hvb == 'Both' || hvb == 'Horizontal') {
                if (controllers[indxs0].axes[2] < -.5) { output += 'Left' } 
                else if (controllers[indxs].axes[2] > .5) { output += 'Right' }
            }
        };
        return (output);
    };

    ext.getStickFacing = function(indx, stick, dir) {
    	var indxs = parseInt(indx)-1;
        if (stick == 'Left') {
    	    switch(dir) {
	            case 'Up': 			return (controllers[indxs].axes[1] < -.5); break;
	            case 'Down': 		return (controllers[indxs].axes[1] > .5);  break;
	            case 'Left': 		return (controllers[indxs].axes[0] < -.5); break;
		      	case 'Right': 		return (controllers[indxs].axes[0] > .5);  break;
		      	case 'Up Left': 	return (controllers[indxs].axes[1] < -.5 && (controllers[indxs].axes[0] < -.5)); break;
		      	case 'Up Right': 	return (controllers[indxs].axes[1] < -.5 && (controllers[indxs].axes[0] > .5));  break;
		      	case 'Down Left': 	return (controllers[indxs].axes[1] > .5  && (controllers[indxs].axes[0] < -.5)); break;
		      	case 'Down Right': 	return (controllers[indxs].axes[1] > .5  && (controllers[indxs].axes[0] > .5));  break;
	        }
        }
        if (stick == 'Right') {
        	switch(dir) {
	            case 'Up': 			return (controllers[indxs].axes[5] < -.5); break;
	            case 'Down': 		return (controllers[indxs].axes[5] > .5);  break;
	            case 'Left': 		return (controllers[indxs].axes[2] < -.5); break;
		      	case 'Right': 		return (controllers[indxs].axes[2] > .5);  break;
		      	case 'Up Left': 	return (controllers[indxs].axes[5] < -.5 && (controllers[indxs].axes[2] < -.5)); break;
		      	case 'Up Right': 	return (controllers[indxs].axes[5] < -.5 && (controllers[indxs].axes[2] > .5));  break;
		      	case 'Down Left': 	return (controllers[indxs].axes[5] > .5  && (controllers[indxs].axes[2] < -.5)); break;
		      	case 'Down Right': 	return (controllers[indxs].axes[5] > .5  && (controllers[indxs].axes[2] > .5));  break;
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
			['h', 'When GP# %m.devices %m.sticks stick is facing %m.directions', 	'getStickFacing', '1', 	'Left', 'Up'],
			['b', 'GP# %m.devices %m.sticks stick is facing %m.directions?',	    'getStickFacing', '1',	'Left', 'Up'], 
			['-'],
			['r', 'GP# %m.devices %m.sticks stick %m.hv position', 	 'getStickPosition',  '1', 'Left', 'Horizontal'],
			['r', 'GP# %m.devices %m.sticks stick %m.hvb direction', 'getStickDirection', '1', 	'Left', 'Both'],
			['-'], 
			['r', 'GP# %m.devices %m.sticks stick %m.axisValue', 'getStickState', '1', 'Left', 'Angle']
		],
		menus: {
			devices: 	controllerList,
			buttons: 	buttonList,
			sticks: 	['Left', 'Right'],
			axisValue: 	['Angle', 'Force', 'ForceX', 'ForceY'],
			hv: 		['Horizontal', 'Vertical'],
			hvb: 		['Horizontal', 'Vertical', 'Both'],
			directions: ['Up', 'Down', 'Left', 'Right', 'Up Left', 'Up Right', 'Down Left', 'Down Right']
		},
		url: 'https://arm923i.github.io/scratch-devices/',
		displayName: '@arm923i Gamepad'
    };

    ScratchExtensions.register('@arm923i Gamepad', descriptor, ext);
})({});