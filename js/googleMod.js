let slajd = new Flickity( '.main-carousel');

window.initMap = function() {
  const mapBox = document.getElementById('map');
  // Zapisujemy w zmiennej obiekt zawierający współrzędne geograficzne.

  infos.innerHTML = '';
 let map = {}, marker = {};


  function initialize() {

    setMap(slajdData[0].coords);
    let i = 0;
    for ( i; i < slajdData.length; i++) {
      addMarker(slajdData[i].coords);
    }

  }


  google.maps.event.addDomListener(window, 'load', initialize);


  function setMap(coords) {
    map = new google.maps.Map(mapBox, {
      zoom: 6,
      center: new google.maps.LatLng(coords),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  function addMarker(location) {
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }


  /* Jak widzisz, guzik "Center map" nagle przeskakuje do docelowych pozycji i powiększenia.

  Jako alternatywę przygotowaliśmy funkcję smoothPanAndZoom, która korzysta z funkcji smoothZoom i smoothPan.
  Jest to nasz własny kod, który jest przykładem tego w jaki sposób można wykorzystać JavaScript oraz
  podstawy matematyki do wykonania ciekawych manipulacji.

  Aby zobaczyć ten efekt w akcji, kliknij najpierw guzik "Center map", a następnie "Center smoothly".
  */



  var smoothPanAndZoom = function(map, zoom, coords){
    // Trochę obliczeń, aby wyliczyć odpowiedni zoom do którego ma oddalić się mapa na początku animacji.
    var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
    jumpZoom = Math.min(jumpZoom, zoom -1);
    jumpZoom = Math.max(jumpZoom, 3);

    // Zaczynamy od oddalenia mapy do wyliczonego powiększenia.
    smoothZoom(map, jumpZoom, function(){
      // Następnie przesuwamy mapę do żądanych współrzędnych.
      smoothPan(map, coords, function(){
        // Na końcu powiększamy mapę do żądanego powiększenia.
        smoothZoom(map, zoom);
      });
    });
  };

  var smoothZoom = function(map, zoom, callback) {
    var startingZoom = map.getZoom();
    var steps = Math.abs(startingZoom - zoom);

    // Jeśli steps == 0, czyli startingZoom == zoom
    if(!steps) {
      // Jeśli podano trzeci argument
      if(callback) {
        // Wywołaj funkcję podaną jako trzeci argument.
        callback();
      }
      // Zakończ działanie funkcji
      return;
    }
    // Trochę matematyki, dzięki której otrzymamy -1 lub 1, w zależności od tego czy startingZoom jest mniejszy od zoom
    var stepChange = - (startingZoom - zoom) / steps;

    var i = 0;
    // Wywołujemy setInterval, który będzie wykonywał funkcję co X milisekund (X podany jako drugi argument,
    // w naszym przypadku 80)
    var timer = window.setInterval(function(){
      // Jeśli wykonano odpowiednią liczbę kroków
      if(++i >= steps) {
        // Wyczyść timer, czyli przestań wykonywać funkcję podaną w powyższm setInterval
        window.clearInterval(timer);
        // Jeśli podano trzeci argument
        if(callback) {
          // Wykonaj funkcję podaną jako trzeci argument
          callback();
        }
      }
      // Skorzystaj z metody setZoom obiektu map, aby zmienić powiększenie na zaokrąglony wynik poniższego obliczenia
      map.setZoom(Math.round(startingZoom + stepChange * i));
    }, 80);
  };

  // Poniższa funkcja działa bardzo podobnie do smoothZoom. Spróbuj samodzielnie ją przeanalizować.
  var smoothPan = function(map, coords, callback) {
    var mapCenter = map.getCenter();
    coords = new google.maps.LatLng(coords);

    var steps = 12;
    var panStep = {lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps};

    var i = 0;
    var timer = window.setInterval(function(){
      if(++i >= steps) {
        window.clearInterval(timer);
        if(callback) callback();
      }
      map.panTo({lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i});
    }, 1000/30);
  };
};