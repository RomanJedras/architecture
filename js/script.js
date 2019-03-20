(function(){

  let templateList = document.getElementById('template-slaider-list').innerHTML;
  Mustache.parse(templateList);
  let listItems = '';
  let slajdDataCount  =  slajdData.length;
  for(var i = 0; i < slajdDataCount; i++) {
    listItems += Mustache.render(templateList, slajdData[i]);
  }
  let results = document.getElementById('results');
  results.insertAdjacentHTML('beforeend', listItems);
})();




$( document ).ready(function() {

  let $carousel = $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true,
        pageDots: false,
        hash: true
    });


   $carousel.on( 'scroll.flickity', function( event, progress ) {
        $('#progress').width( progress * 100 + '%' );
    });

    $('#reset').on('click', function () {
        $carousel.flickity('previous');
    });
});




