let slajd = new Flickity( '.main-carousel');

window.initMap = function() {

  // Zapisujemy w zmiennej obiekt zawierający współrzędne geograficzne.

  infos.innerHTML = '';
 let map = {}, marker = {};
 let idHash = location.hash.replace("#",'');
 const mapBox = document.getElementById('map');
 let progress = {};
 let lastChar = idHash.substr(idHash.length -1);
 let j = 0;


    function initialize() {

    lastChar = parseInt(lastChar);
    if (lastChar >= 1 ) {
      lastChar = lastChar - 1;
    }

    slajd.select( lastChar );

    slajdData.forEach(function(item) {

        if ( idHash === '' ) {

          setMap(slajdData[0].coords);
          addMarker(slajdData[0].coords,j);
          progress.params = item.coords;
          progress.id = slajdData[0].id;
          sampleCenter(progress.params);
          markerClick(slajdData[0].title);

        } else if (idHash === item.id) {

          setMap(item.coords);
          addMarker(item.coords,j);
          progress.params = item.coords;
          progress.id = item.id;
          sampleCenter(progress.params);
          markerClick(item.title);
        }
    });

    j += 1;

  }


  let nodes = document.querySelectorAll('#link a'),
    countLink = nodes.length;

  for (let i = 0; i < countLink; i++) {
    nodes[i].addEventListener('click', function(i) {
      setMap(slajdData[i].coords);
      slajd.select(i);
      progress.id = slajdData[i].id;
      progress.title = slajdData[i].title;
      addMarker(slajdData[i].coords,i);
      sampleCenter(slajdData[i].coords);
    }.bind(null, i));
  }


  slajd.on( 'change', function( index ) {

    setMap(slajdData[index].coords);
    progress.id = slajdData[index].id;
    addMarker(slajdData[index].coords,index);
    sampleCenter(slajdData[index].coords);
    markerClick(slajdData[index].title);
  });


 function setMap(coords) {
   map = new google.maps.Map(mapBox, {
     // Podajemy opcje mapy, np. zoom i punkt wycentrowania mapy.
     zoom: 12,
     center: coords
   });

 }


 function sampleCenter(params) {

   document.getElementById ('center-map').addEventListener('click', function(event){
     event.preventDefault();
     // Najpierw wykorzystujemy metodę panTo w obiekcie map do przesunięcia współrzędnych mapy:
     map.panTo(params);

     // A następnie zmieniamy powiększenie mapy:
     map.setZoom(10);
   });

   document.getElementById ('center-smooth').addEventListener('click', function(event){
     event.preventDefault();
     smoothPanAndZoom(map, 7, params);
   });


 }

  function addMarker(location,index) {
    marker = new google.maps.Marker({
      position: location,
      map: map
    });

    marker.addListener('click',function() {
      infos.innerHTML = progress.title;
      slajd.select(index - 1);
    });
 }


  function markerClick(title) {
    infos.innerHTML = '';
    marker.addListener('click', function() {
      infos.innerHTML = title;
    });
  }


  google.maps.event.addDomListener(window, 'load', initialize);












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