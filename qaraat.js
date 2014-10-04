var styles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#364B5C" }]
    },{
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#ffffff" }]
    },{
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#465e74" }]
    },{
        "featureType": "road.local",
        "stylers": [{ "weight": 0.6 },{ "color": "#2f4052" }]
    },{
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#364B5C" },{ "weight": 3 },{ "visibility": "on" }]
    },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#2f4052" }]
    },{
        "featureType": "poi",
        "stylers": [{ "color": "#465e74" }]
    },{
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{ "visibility": "off" }]
    },{
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#ffffff" }]
    },{
        "elementType": "labels.text.stroke",
        "stylers": [{ "visibility": "off" }]
    },{
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },{
        "featureType": "transit",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#465e74" }]
    }
];

function nextLocation(){
    map.setZoom(16);
    if(currentIndex!=0){
        currentIndex = currentIndex - 1;
        map.setCenter(bookCoordinates[currentIndex]);
    }else{
        currentIndex = bookCoordinates.length-1;
        map.setCenter(bookCoordinates[currentIndex]);
    }
    $('html, body').animate({scrollTop:$('#timeline-location-block-'+(currentIndex+1)).offset().top-125}, 500);
    $('.timeline-location-block').removeClass('highlighted');
    $('#timeline-location-block-'+(currentIndex+1)).addClass('highlighted');
    $('#map-location h2').text(coordinatesInfo[currentIndex][0]);
    $('#map-location a span').text(coordinatesInfo[currentIndex][1]);
}
function prevLocation(){
    map.setZoom(16);
    if(currentIndex!=bookCoordinates.length-1){
        currentIndex = currentIndex + 1;
        map.setCenter(bookCoordinates[currentIndex]);
    }else{
        currentIndex = 0;
        map.setCenter(bookCoordinates[currentIndex]);
    }
    $('html, body').animate({scrollTop:$('#timeline-location-block-'+(currentIndex+1)).offset().top-125}, 500);
    $('.timeline-location-block').removeClass('highlighted');
    $('#timeline-location-block-'+(currentIndex+1)).addClass('highlighted');
    $('#map-location h2').text(coordinatesInfo[currentIndex][0]);
    $('#map-location a span').text(coordinatesInfo[currentIndex][1]);
}
function zoomIn(){
    map.setZoom(map.getZoom()+1);
}
function zoomOut(){
    map.setZoom(Math.max(2,map.getZoom()-1));
}

function initializeBookPage(){
    setBookPageDimensions();
    initializeBookMap();
}

function setBookPageDimensions(){
    col1ST = $('.container > .col-1st .content');
    $(col1ST).scroll(function (){
        if (isScrollBottom($(col1ST))) {
            col1ST.attr('bottom-reached', 'true');
            col1ST.parent().find('.scroll-indicator').fadeOut(300);
        }else{
            if(col1ST.is('[bottom-reached]')){
                col1ST.parent().find('.scroll-indicator').fadeIn(300);
                col1ST.removeAttr('bottom-reached');
            }
        }
    });
    
    var windowHeight = window.innerHeight;
    var value1 = $('#header').height();
    var value2 = $('#subheader').height();
    var value6 = $('.container > .col-2nd .content.stats-holder').height();
    
    $('#map-canvas, .container > .col-2nd .content.map-holder').height(windowHeight-value1-value2-value6);
    $('.container > .col-1st').height(windowHeight-value1);
}



function isScrollBottom(subject) {
    var elementHeight = subject[0].scrollHeight;
    var scrollPosition = subject.height() + subject.scrollTop();
    return (elementHeight == scrollPosition);
};

function initializeBookMap(){
    currentIndex = bookCoordinates.length-1;
    var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
    var mapOptions = {
        zoom: 16,
        center: bookCoordinates[currentIndex],
        disableDefaultUI: true,
        scrollwheel: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 3,
        strokeWeight: 3,
        strokeColor: '#c93365',
    };
    var bookPath = new google.maps.Polyline({
        path: bookCoordinates,
        geodesic: false,
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px'
        }],
    });
    currentIndex = bookCoordinates.length-1;
    bookPath.setMap(map);
    var bookIcon = new google.maps.MarkerImage("logo.svg",
        null, 
        new google.maps.Point(0,0),
        new google.maps.Point(0, 51)
    );
    for (var i = 0; i < bookCoordinates.length; i++) {
        var marker = new google.maps.Marker({
            position: bookCoordinates[i],
            map: map,
            icon: bookIcon,
            animation: google.maps.Animation.DROP,
            title: coordinatesInfo[i][0]+' - '+coordinatesInfo[i][1],
            zIndex: i+1
        });
    }
    initMapKeyNav();
    initMapZoom();
    initMapNav();
}
function initMapKeyNav(){
    $(document).on('keydown',function(e){if(e.keyCode==39){nextLocation();}else if(e.keyCode==37){prevLocation();}});
}
function initMapZoom(){
    $('#map-tools ul:first-child li:first-child').on('click', zoomIn);
    $('#map-tools ul:first-child li:last-child').on('click', zoomOut);
}
function initMapNav(){
    $('#map-tools ul:last-child li:first-child').on('click', nextLocation);
    $('#map-tools ul:last-child li:last-child').on('click', prevLocation);
}