var gamepadSupport = {
    ticking: false,
    gamepads: [],
    prevRawGamepadTypes: [],
    prevTimestamps: [],
    init: function() {
        var gamepadSupportAvailable = !!navigator.webkitGetGamepads 
                                        || !!navigator.webkitGamepads 
                                        || (navigator.userAgent.indexOf('Firefox/') != -1);

        if (!gamepadSupportAvailable) {
            console.log('GamePad API not supported');
        } else {
            window.addEventListener('MozGamepadConnected', gamepadSupport.onGamepadConnect, false);
            window.addEventListener('MozGamepadDisconnected', gamepadSupport.onGamepadDisconnect, false);
            if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
                gamepadSupport.startPolling();
            }
        }
    },
    onGamepadConnect: function(event) {
        gamepadSupport.gamepads.push(event.gamepad);
        console.log('gamepad connected');
        gamepadSupport.startPolling();
    },
    onGamepadDisconnect: function(event) {
        for (var i in gamepadSupport.gamepads) {
            if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
                gamepadSupport.gamepads.splice(i, 1);
                break;
            }
        }
        if (gamepadSupport.gamepads.length == 0) {
            gamepadSupport.stopPolling();
        }
        console.log('gamepad disconnected');
    },
    startPolling: function() {
        if (!gamepadSupport.ticking) {
            gamepadSupport.ticking = true;
            gamepadSupport.tick();
        }
    },stopPolling: function() {
        gamepadSupport.ticking = false;
    },tick: function() {
        gamepadSupport.pollStatus();
        gamepadSupport.scheduleNextTick();
    },
    scheduleNextTick: function() {
        if (gamepadSupport.ticking) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(gamepadSupport.tick);
            } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(gamepadSupport.tick);
            } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(gamepadSupport.tick);
            }
        }
    },
    pollStatus: function() {
        gamepadSupport.pollGamepads();
        for (var i in gamepadSupport.gamepads) {
            var gamepad = gamepadSupport.gamepads[i];
            if (gamepad.timestamp && (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
                continue;
            }
            gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
            gamepadSupport.updateDisplay(i);
        }
    },
    pollGamepads: function() {
        var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;
        if (rawGamepads) {
            gamepadSupport.gamepads = [];
            var gamepadsChanged = false;
            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
                    gamepadsChanged = true;
                    gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                }
                if (rawGamepads[i]) {
                    gamepadSupport.gamepads.push(rawGamepads[i]);
                }
            }
            if (gamepadsChanged) {
                console.log('GamePads changing');
            }
        }
    },updateDisplay: function(gamepadId) {
        var gamepad = gamepadSupport.gamepads[gamepadId];
        // set our code to handle gamepad here
    }};
}
gamepadSupport.init();