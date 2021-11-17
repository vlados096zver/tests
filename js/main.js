
$(document).ready(function() {

  if (window.Swiper) {

    let info_swiper = new Swiper(".info__wrap", {
      slidesPerView: 1,
      preloadImages: false,
      lazy: true,
      pagination: {
        clickable: true,
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".info__block .swiper-button-next",
        prevEl: ".info__block .swiper-button-prev",
      },
      allowTouchMove: true,
    });

    let reviews_swiper = new Swiper(".reviews__wrap", {
      slidesPerView: 3,
      spaceBetween: 24,
      preloadImages: false,
      lazy: true,
      navigation: {
        nextEl: ".reviews__block .swiper-button-next",
        prevEl: ".reviews__block .swiper-button-prev",
      },
      allowTouchMove: true,
      scrollbar: {
        el: ".swiper-scrollbar",
      },
       breakpoints: {
          320: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2,
          },
          1023: {
            slidesPerView: 3,
          }
        }
    });

    let product_swiper = new Swiper(".product__list", {
       slidesPerView: "auto",
      preloadImages: false,
      lazy: true,
      /*navigation: {
        nextEl: ".swiper-button-next.info__button.info__button--next",
        prevEl: ".swiper-button-prev.info__button.info__button--prev",
      },
      pagination: {
        clickable: true,
        el: ".swiper-pagination",
      },*/
      allowTouchMove: true,
      scrollbar: {
        el: ".swiper-scrollbar",
      },
    });

  }

  let elems = $('.reviews__text');
  elems.each(function( index, item ) {
    let heightItem = $(item).find('.reviews__block').height();
    const elem = $(item).parents('.reviews__item');
    const btnItem = elem.find('.reviews__more');
     if(heightItem>112) {
      btnItem.html(btnItem.data('show'));
      btnItem.addClass('reviews__more--active');
       $(item).addClass('reviews__text--gradient');
     }
  })

 $('.reviews__item').on('click', '.reviews__more', function(e) {
  let item = $(e.target).parents('.reviews__item');
  let btn = item.find('.reviews__more');
  let text = item.find('.reviews__text');
  let heightItem = item.find('.reviews__block').height();

  text.toggleClass('reviews__text--active reviews__text--gradient');
   
   if(text.hasClass('reviews__text--active')) {
    btn.html(btn.data('hide'));
    text.css( "height", heightItem );
   } else {
    btn.html(btn.data('show'));
    text.css( "height", "112px" );
   }

 })

      let iframeContainer = $('.map__wrap');
      let advancedOffset = 150;
      let iframeContainerOffsetTop = Math.round(iframeContainer.offset().top);
      let windowHeight = $(window).height();
      let iframeMap = $('.map__wrap').data('map');
      let iframeBlock = `<iframe src="${iframeMap}" style="border:0;" allowfullscreen=""></iframe>`;
    
      // При загрузке страницы делаем проверку, не находится ли наш div в поле видимости, если находится, то мы сразу в него вставляем iframe
      // Если этого не делать, и страница вдруг окажется маленькой по высоте где не будет скролла, то наш div останется без iframe
      if ($(window).scrollTop() >= (iframeContainerOffsetTop - windowHeight - advancedOffset)) {
        iframeContainer.html(iframeBlock);
      }

      $(window).scroll(function () {
        if ($(this).scrollTop() >= (iframeContainerOffsetTop - windowHeight - advancedOffset)) {
          // При прокрутке страницы делаем проверку на наличие iframe внутри div, если его нет, то добавляем в него iframe
          // Если не делать эту проверку, то при каждом скролле у нас в div будет обновляться iframe и по новой загружаться
          if (!iframeContainer.children('iframe').length) {
            iframeContainer.html(iframeBlock);
          }
        }
      });


  function menuShow(){
  $('.menu__list').each(function( index, item ) {
    let elem = $(item).find('li');
      elem.each(function( index, item ) {
        if(index>=4){
           if ($(window).width() < 1250) {
             $(item).hide();
             $(item).parents('.menu__row').find('.menu__more').addClass('menu__more--active');
           } else {
             $(item).show();
           }
        }
      })
  })
}

 menuShow();
  $(window).resize(function () {
    menuShow();
  })

  console.log($('source'));

  $(document).on('click', '.product__elem', function(e) {
    let elem = e.currentTarget;
    let indexElem = $(elem).data('index');
    let parent = $(elem).parents('.product__item');
    let block = parent.find('.product__elem');
    let image = parent.find('.product__image');
      console.log(image);

    block.each(function( index, item ) {
      $(item).removeClass('product__elem--active');
    });
    $(this).addClass('product__elem--active');

    image.each(function( index, item ) {
      $(item).removeClass('product__image--visible');
      image.eq(indexElem).addClass('product__image--visible');
    });
  })

  /*
FOR GOOGLE MAP
*/
const script_google_map = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDaGKtvkZpjDHUvNVUWI4_Q1yXXfRp7B64';
/*prod AIzaSyBMoCnvBTOB5YRy8IY3DaxexpfxwjWoc_I*/

function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(script);

  document.head.append(script);
}

;
$(document).bind('load.map', function (e) {
  e.preventDefault();

  if ($('body').hasClass('gmap')) {// initPopupGlobalMap();
  } else {
    $('body').addClass('gmap');
    loadScript(script_google_map, map_get_first);
  }
});
var gmap = document.getElementById('googleMap');
var gmap_loaded = false;

if (!gmap_loaded) {
  $(document).trigger('load.map');
  gmap_loaded = true;
}

$(document).on('click', '.rebuild_map', function () {
  var link = $(this).data('link');
  var zoom = $(this).data('zoom');
  var pos = [];
  pos.push($(this).data('lat'), $(this).data('lng'));

  if (window.innerWidth < 768) {
    map_get(link, pos, zoom - 2);
  } else {
    map_get(link, pos, zoom);
  }
});

async function map_get(options, position, z) {
  try {
    // Create request to api service
    const url = 'http://localhost:3000/';
    const req = await fetch(url + options, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const res = await req.json(); // Log success message

    build_map(res, position, z);
  } catch (err) {
    $('.master-loading').removeClass('loading');
  }
}

async function map_get_first() {
  try {
    // Create request to api service
    let def = $(document).find('.rebuild_map.default');
    let def_link = $(def).data('link');
    let def_zoom = $(def).data('zoom');
    let def_pos = [];
    def_pos.push($(def).data('lat'), $(def).data('lng'));
    const url = 'http://distar-sl.altsolution.net:9500/';
    const req = await fetch(url + def_link, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const res = await req.json(); // Log success message

    if (window.innerWidth < 768) {
      build_map(res, def_pos, def_zoom - 1);
    } else {
      build_map(res, def_pos, def_zoom);
    }
  } catch (err) {
    $('.master-loading').removeClass('loading');
    console.error(`ERROR: err`, err);
  }
}

function build_map(m_array, pos, z) {
  if (!pos) {
    pos = [];
    pos.push($('.contacts-content').find('.rebuild_map:first').data('lat'), $('.contacts-content').find('.rebuild_map:first').data('lng'));
  }

  gmap.innerHTML = "";
  var map = null;
  var markerArray = []; //create a global array to store markers

  function initialize() {
    var myOptions = {
      zoom: z,
      scrollwheel: true,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      scrollwheel: false,
      fullscreenControl: false,
      center: new google.maps.LatLng(pos[0], pos[1]),
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), myOptions);
    google.maps.event.addListener(map, 'click', function () {
      infowindow.close();
    }); // Add markers to the map
    // Set up markers based on the number of elements within the m_array array

    createMarker(new google.maps.LatLng(m_array.markerLat, m_array.markerLng), m_array.markerContent);
  }

  var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50),
    maxWidth: 300
  });

  function createMarker(latlng, html) {
    var contentString = html;
    var icon = {
      url: "images/png/marker.png",
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0)
    };
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: icon
    });
    marker.setAnimation(null);
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
    markerArray.push(marker); //push local var marker into global array
  }

  initialize();
}

});

