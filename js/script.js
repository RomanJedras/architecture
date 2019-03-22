
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
    $carousel.flickity()
      .flickity( 'select', 0 );
  });


});




