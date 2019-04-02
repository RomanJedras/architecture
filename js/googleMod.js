let slajd = new Flickity( '.main-carousel');

    window.initMap = function() {
      const mapBox = document.getElementById('map');
      // Zapisujemy w zmiennej obiekt zawierający współrzędne geograficzne.
      infos.innerHTML = '';
      let map = {}, marker = {};


      function initialize() {

        setMap(slajdData[0].coords, 6);
        let i = 0;

        for (i; i < slajdData.length; i++) {
          addMarker(slajdData[i].coords);

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infos.innerHTML = slajdData[i].title;
              slajd.select(i);

            }
          })(marker, i));
        }

      };

      slajd.on('change', function(index) {
        setMap(slajdData[index].coords, 10);
        addMarker(slajdData[index].coords);
      });

      let nodes = document.querySelectorAll('#link a'),
        countLink = nodes.length;

      for (let i = 0; i < countLink; i++) {
        nodes[i].addEventListener('click', function() {
          setMap(slajdData[i].coords, 14);
          slajd.select(i);
          addMarker(slajdData[i].coords);
        })
      }


      google.maps.event.addDomListener(window, 'load', initialize);


      function setMap(coords, zoom) {
        map = new google.maps.Map(mapBox, {
          zoom: zoom,
          center: new google.maps.LatLng(coords),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
      }


      function addMarker(location) {
        let i = '';
        marker = new google.maps.Marker({
          position: location,
          map: map
        });
      }

    }




