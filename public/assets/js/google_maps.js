      
      function initMap() {
        var myLatLng = {lat: 50.473971, lng: 30.595939};

        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('api_map'), {
          center: myLatLng,
          scrollwheel: false,
          zoom: 17
        });

        // Create a marker and set its position.
        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          title: 'бульвар Перова, 1Б'
        });
      }

     


        