(function() {


  let templateList = document.getElementById('template-slaider-list').innerHTML;
  Mustache.parse(templateList);
  let listItems = '';
  let slajdDataCount = slajdData.length;

  for (let i = 0; i < slajdDataCount; i++) {
    listItems += Mustache.render(templateList, slajdData[i]);
  }

  let results = document.getElementById('results');
  results.insertAdjacentHTML('beforeend', listItems);


  let slajd = new Flickity('.main-carousel');

  slajd.option({
      cellAlign: 'left',
      contain: true,
      pageDots: false,
      hash: true
    }
  );

  let progressBar = document.querySelector('.progress-bar');

  slajd.on('scroll', function(progress) {

    progress = Math.max(0, Math.min(1, progress));

    progressBar.style.width = progress * 100 + '%';
  });

  document.getElementById('reset').addEventListener('click', function() {
    slajd.select(0);
  });

  window.initMap = function() {
    const mapBox = document.getElementById('map');
    // Zapisujemy w zmiennej obiekt zawierający współrzędne geograficzne.
    let map = {}, marker = {};
    let countLink = slajdData.length;

    function initialize() {

      setMap(slajdData[0].coords, 6);


      for (let i = 0; i < countLink; i++) {
        addMarker(slajdData[i].coords);

        google.maps.event.addListener(marker, 'click', function() {
         slajd.select(i);
        });
      }
    }

    slajd.on('change', function(index) {
      map.panTo(slajdData[index].coords);
      map.setZoom(10);
    });

    let nodes = document.querySelectorAll('#link a');


    for (let i = 0; i < countLink; i++) {
      nodes[i].addEventListener('click', function() {
      map.panTo(slajdData[i].coords);
      map.setZoom(10);
      slajd.select(i);
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
      marker = new google.maps.Marker({
        position: location,
        map: map
      });
    };

  };

})();


















