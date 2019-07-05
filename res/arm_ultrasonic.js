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

	var CMD_DIGITAL_WRITE = 0x73,
	    CMD_PIN_MODE = 0x75,
	    CMD_DIGITAL_READ = 0x79,
	    CMD_PING = 0x7C,
	    CMD_PING_CONFIRM = 0x7D;

	var  DIGITAL_PINS = [8, 9];

 	var LOW = 0,
  	 	HIGH = 1;

  var INPUT = 0,
    OUTPUT = 1;


	var digitalInputData = new Uint8Array(12),
	    pinModes = new Uint8Array(12),
	    analogInputData = new Uint8Array(6);

	var device = null;


	  function digitalRead(pin) {
	    if (DIGITAL_PINS.indexOf(parseInt(pin)) === -1) return;
	    if (pinModes[pin-2] != INPUT)
	      pinMode(pin, INPUT);
	    return digitalInputData[parseInt(pin)-2];
	  }

	   function digitalWrite(pin, val) {
	    if (DIGITAL_PINS.indexOf(parseInt(pin)) === -1) return;
	    device.send(new Uint8Array([CMD_DIGITAL_WRITE, pin, val]).buffer);
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
    case CMD_DIGITAL_READ:
      digitalInputData = storedInputData.slice(0, 12);
      break;
    }
  }

    ext.digitalWrite = function(pin, val) {
	    if (val == 'on')
	      digitalWrite(pin, HIGH);
	    else if (val == 'off')
	      digitalWrite(pin, LOW);
	  };
	    ext.digitalRead = function(pin) {
	    return digitalRead(pin);
	  };

	  ext.whenDigitalRead = function(pin, val) {
    if (val == 'on')
      return digitalRead(pin);
    else if (val == 'off') {
      return digitalRead(pin) == 0;
    }
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
		['h', 'when distance %m.ops %n sm', 'whenDigitalRead', '>', 800],
		['b', 'distance %m.ops %n sm', 'digitalRead',  '>', 800],	
		['r', 'distance', 'digitalRead']
	];

	var menus = {
		outputs: ['on', 'off'],
		ops: ['>', '=', '<']
	};

	var descriptor = {
		blocks: blocks,
		menus: menus,
		url: 'https://arm923i.github.io/scratch-devices/'
	};

	ScratchExtensions.register('Arduino ultrasonic', descriptor, ext, {type:'serial'});

})({});