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




	ScratchExtensions.register('Arduino', descriptor, ext, {type:'serial'});

})({});