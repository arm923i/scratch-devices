(function(ext) {
    // Cleanup  function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_temp = function(location) {
        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
              url: 'https://openweathermap.org/data/2.5/weather?q='+location+'&appid=b6907d289e10d714a6e88b30761fae22',
              dataType: 'jsonp',
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  temperature = weather_data['main']['temp'];
                  return temperature;
              }
        });
    }; 

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['r', 'current temperature in city %s', 'get_temp', 'Odessa'],
        ],
         url: 'http://arm923i.github.io/gamepad-scratch-extension/'
    };

    // Register the extension
    ScratchExtensions.register('Weather extension', descriptor, ext);
}); 