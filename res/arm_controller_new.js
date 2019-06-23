(function(ext) {
    ext._shutdown = function() {};
    var haveEvents = "ongamepadconnected" in window,
        controllers = {};

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
        addgamepad(e.gamepad) // Add the controller to the "controllers" object
    }

    function addgamepad(e) {
        controllers[e.index] = e // Add the controller to the "controllers" object
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad) // Handle Disconnects
    }

    function removegamepad(e) {
        delete controllers[e.index] // Remove controllers when disconnected
    }

    function updateStatus() {
        haveEvents || scangamepads(), requestAnimationFrame(updateStatus) // Update the controller values
    }

    function scangamepads() {
        for (var e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [], n = 0; n < e.length; n++) e[n] && (e[n].index in controllers ? controllers[e[n].index] = e[n] : addgamepad(e[n]))
    }
    window.addEventListener("gamepadconnected", connecthandler), window.addEventListener("gamepaddisconnected", disconnecthandler), haveEvents || setInterval(scangamepads, 1); // When the controller is detected, enable the extension
   
    ext._getStatus = function() {
        return {
            status: 2,
            msg: 'Ready'
        };
    };
    
    ext.stickDirection = {left: 90, right: 90};

    var dz = 8000 / 32767; // Deadzone

     ext.getButton = function(name) {
	    var index = buttonNames[name];
	    var button = controllers[0].buttons[index];
	    return button.pressed;
	  };

     ext.getStick = function(what, stick) {
	    var x, y;
	    switch (stick) {
	      case "left":  x = controllers[0].axes[0]; y = -controllers[0].axes[1]; break;
	      case "right": x = controllers[0].axes[5]; y = -controllers[0].axes[2]; break;
	    }
	    switch (what) {
	      case "direction":
	        if (x === 0 && y === 0) {
	          return ext.stickDirection[stick];
	        }
	        var value = (180 * Math.atan2(x, y) / Math.PI) + 135;
	        ext.stickDirection[stick] = value;
	        return value;
	      case "forceX":
	        return x*5;
	      case "forceY":
	        return y*5;
	    }
	  };
    
    ext.aefe = function(s,af) { // Return the force or angle of a specified stick
        var xp, yp;
        switch (s) {
            case "Left":
                x = controllers[0].axes[0];
                y = -controllers[0].axes[1];
                break;
            case "Right":
                x = controllers[0].axes[5];
                y = -controllers[0].axes[2];
                break;
        }
        if (-dz < x && x < dz) x = 0;
        if (-dz < y && y < dz) y = 0;
        switch(af) {
            case "Angle":
                return(value = 180 * Math.atan2(x, y) / Math.PI);
            break;
            
            case "Force":
                return Math.sqrt(x*x + y*y);
            break;
        }
    };

    ext.stickpos = function(s, hv) {
        return (controllers[0].axes[(["LeftHorizontal", "LeftVertical", "RightHorizontal", "", "", "RightVertical"].indexOf(s + hv))].toFixed(2)); // Return the value of the axes for the stick and the direction specified
    };

    ext.stickfacing = function(s, hvb) { // Return a plaintext direction for a control stick
        let output = "";
        if (s == "Left") {
            if (hvb == "Both" || hvb == "Vertical") {
                if (controllers[0].axes[1] < -.5) {
                    output += "Up "
                } else if (controllers[0].axes[1] > .5) {
                    output += "Down "
                }
            }
            if (hvb == "Both" || hvb == "Horizontal") {
                if (controllers[0].axes[0] < -.5) {
                    output += "Left"
                } else if (controllers[0].axes[0] > .5) {
                    output += "Right"
                }
            }
        };
        if (s == "Right") {
            if (hvb == "Both" || hvb == "Vertical") {
                if (controllers[0].axes[5] < -.5) {
                    output += "Up "
                } else if (controllers[0].axes[5] > .5) {
                    output += "Down "
                }
            }
            if (hvb == "Both" || hvb == "Horizontal") {
                if (controllers[0].axes[2] < -.5) {
                    output += "Left"
                } else if (controllers[0].axes[2] > .5) {
                    output += "Right"
                }
            }
        };
        return (output);
    };

    ext.stickis = function(s, dir) { // Return true or false depending on if the specified stick is facing a direction
        if (s == "Left") {
            if (dir == "Up") {
                return (controllers[0].axes[1] < -.5)
            }
            if (dir == "Down") {
                return (controllers[0].axes[1] > .5)
            }
            if (dir == "Left") {
                return (controllers[0].axes[0] < -.5)
            }
            if (dir == "Right") {
                return (controllers[0].axes[0] > .5)
            }
            if (dir == "Up Left") {
                return (controllers[0].axes[1] < -.5 && (controllers[0].axes[0] < -.5))
            }
            if (dir == "Up Right") {
                return (controllers[0].axes[1] < -.5 && (controllers[0].axes[0] > .5))
            }
            if (dir == "Down Left") {
                return (controllers[0].axes[1] > .5 && (controllers[0].axes[0] < -.5))
            }
            if (dir == "Down Right") {
                return (controllers[0].axes[1] > .5 && (controllers[0].axes[0] > .5))
            }
        }
        if (s == "Left") {
            if (dir == "Up") {
                return (controllers[0].axes[5] < -.5)
            }
            if (dir == "Down") {
                return (controllers[0].axes[5] > .5)
            }
            if (dir == "Left") {
                return (controllers[0].axes[2] < -.5)
            }
            if (dir == "Right") {
                return (controllers[0].axes[2] > .5)
            }
            if (dir == "Up Left") {
                return (controllers[0].axes[5] < -.5 && (controllers[0].axes[2] < -.5))
            }
            if (dir == "Up Right") {
                return (controllers[0].axes[5] < -.5 && (controllers[0].axes[2] > .5))
            }
            if (dir == "Down Left") {
                return (controllers[0].axes[5] > .5 && (controllers[0].axes[2] < -.5))
            }
            if (dir == "Down Right") {
                return (controllers[0].axes[5] > .5 && (controllers[0].axes[2] > .5))
            }
        }
    };

    var descriptor = {
        blocks: [
            ["h", "When button %m.buttons pressed", "getButton", "X"],
            ["b", "button %m.buttons pressed", "getButton", "X"],
            ['r', '%m.lr stick %m.hv position', 'stickpos', "Left", "Horizontal"],
            ['r', '%m.lr stick %m.hvb direction', 'stickfacing', "Left", "Both"],
            ['b', '%m.lr stick is facing %m.dir?', 'stickis', "Left", "Up"],
            ['h', 'When %m.lr stick is facing %m.dir', 'stickis', "Left", "Up"],
            ['r', '%m.lr stick %m.aefe', 'aefe', 'Left', "Angle"],   
    		["r", "%m.axisValue of %m.sticks stick", "getStick", "direction", "left"],
        ],
        menus: {
        	buttons: buttonList,
	      	sticks: ["left", "right"],
	     	axisValue: ["direction", "forceX", "forceY"],
            lr: ["Left", "Right"],
            hv: ["Horizontal", "Vertical"],
            hvb: ["Horizontal", "Vertical", "Both"],
            dir: ["Up", "Down", "Left", "Right", "Up Left", "Up Right", "Down Left", "Down Right"],
            aefe: ["Angle", "Force"]
        }
    };

    ScratchExtensions.register('Gamepad', descriptor, ext); // Register the extension so scratch can use it
})({});