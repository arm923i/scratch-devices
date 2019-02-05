(function(ext) {
    // Cleanup  function when the extension is unloaded
    ext._shutdown = function() {
      controller = null;
      connected = false;
    };  

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
     ext._getStatus = function() {
      if (!connected)
        return { status:1, msg:'Disconnected' };
      else
        return { status:2, msg:'Connected' };
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
            ['R', 'current temperature in city %m.city', 'get_temp', 'Odessa'],
        ],
        menus: {
            city: ['Odessa', 'Kherson']
        },  
         url: 'http://arm923i.github.io/gamepad-scratch-extension/'
    };

    // Register the extension
    ScratchExtensions.register('Weather extension', descriptor, ext);
}); 