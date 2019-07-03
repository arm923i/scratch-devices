(function(ext) {

	var potentialDevices = [];
	var watchdog = null;
	var poller = null;
	var lastReadTime = 0;
	var connected = false;
	var command = null;
	var parsingCmd = false;
	var bytesRead = 0;
	var waitForData = 0;
	var storedInputData = new Uint8Array(4096);

	var CMD_PIN_MODE = 0x75,
	    CMD_ANALOG_READ = 0x78;

	var ANALOG_PINS = 'A0';

 	var LOW = 0,
   	HIGH = 1;

  var INPUT = 0,
    OUTPUT = 1;


	var digitalInputData = new Uint8Array(12),
	    pinModes = new Uint8Array(12),
	    analogInputData = new Uint8Array(6),
	    accelInputData = [0,0],
	    imuEventData = new Uint8Array(3),
	    servoVals = new Uint8Array(12);

	var device = null;


	function analogRead(aPin) {
		return Math.round(map(analogInputData[pin], 0, 255, 0, 100));
	}

	function map(val, aMin, aMax, bMin, bMax) {
		if (val > aMax) val = aMax;
		else if (val < aMin) val = aMin;
		return (((bMax - bMin) * (val - aMin)) / (aMax - aMin)) + bMin;
	}

	function pinMode(pin, mode) {
		device.send(new Uint8Array([CMD_PIN_MODE, pin, mode]).buffer);
	}

	function tryNextDevice() {
		device = potentialDevices.shift();
		if (!device) return;
		device.open({stopBits: 0, bitRate: 57600, ctsFlowControl: 0}, function() {
		  device.set_receive_handler(function(data) {
		    processInput(new Uint8Array(data));
		  });
		});

		poller = setInterval(function() {
		  pingDevice();
		}, 1000);

		watchdog = setTimeout(function() {
		  clearTimeout(poller);
		  poller = null;
		  device.set_receive_handler(null);
		  device.close();
		  device = null;
		  tryNextDevice();
		}, 5000);
	}

	function pingDevice() {
		device.send(new Uint8Array([CMD_PING]).buffer);
	}

	function processInput(inputData) {
    lastReadTime = Date.now();
    for (var i=0; i<inputData.length; i++) {
      if (parsingCmd) {
        storedInputData[bytesRead++] = inputData[i];
        if (bytesRead === waitForData) {
          parsingCmd = false;
          processCmd();
        }
      } else {
        switch (inputData[i]) {
        case CMD_PING:
          parsingCmd = true;
          command = inputData[i];
          waitForData = 2;
          bytesRead = 0;
          break;
        case CMD_ANALOG_READ:
          parsingCmd = true;
          command = inputData[i];
          waitForData = 6;
          bytesRead = 0;
          break;
        }
      }
    }
  }

  function processCmd() {
    switch (command) {
    case CMD_PING:
      if (storedInputData[0] === CMD_PING_CONFIRM) {
        connected = true;
        clearTimeout(watchdog);
        watchdog = null;
        clearInterval(poller);
        poller = setInterval(function() {
          if (Date.now() - lastReadTime > 5000) {
            connected = false;
            device.set_receive_handler(null);
            device.close();
            device = null;
            clearInterval(poller);
            poller = null;
          }
        }, 2000);
      }
      break;
    case CMD_ANALOG_READ:
      analogInputData = storedInputData.slice(0, 6);
      break;
    }
  }
	ext.analogRead = function(pin) {
	    return analogRead(pin);
	  };


	  ext.whenAnalogRead = function(pin, op, val) {
	    if (ANALOG_PINS.indexOf(pin) === -1) return
	    if (op == '>')
	      return analogRead(pin) > val;
	    else if (op == '<')
	      return analogRead(pin) < val;
	    else if (op == '=')
	      return analogRead(pin) == val;
	    else
	      return false;
	  };


	ext._getStatus = function() {
		if (connected) return {status: 2, msg: 'Arduino connected'};
		else return {status: 1, msg: 'Arduino disconnected'};
	};

	ext._deviceConnected = function(dev) {
		potentialDevices.push(dev);
		if (!device) tryNextDevice();
	};

	ext._deviceRemoved = function(dev) {
		console.log('device removed');
		pinModes = new Uint8Array(12);
		if (device != dev) return;
		device = null;
	};

	ext._shutdown = function() {
		// TODO: Bring all pins down
		if (device) device.close();
		device = null;
	};


	var blocks = [
		['h', 'when humidity %m.ops %n', 'AnalogRead', '>', 800],
		['b', 'humidity %m.ops %n', 'analogRead',  '>', 800],	
		['r', 'humidity', 'analogRead']
	];

	var menus = {
		ops: ['>', '=', '<']
	};

	var descriptor = {
		blocks: blocks,
		menus: menus,
		url: 'https://arm923i.github.io/scratch-devices/'
	};

	ScratchExtensions.register('Arduino humidity', descriptor, ext, {type:'serial'});

})({});