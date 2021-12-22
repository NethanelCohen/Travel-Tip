// import { json } from "express/lib/response";

export const mapService = {
    initMap,
    addMarker,
    panTo,
    currMarker
}

var gMap;
var currMarker;

// var gMarkers = [];
// const MARKERS_KEY = 'markersDB';

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    // gMarkers = loadFromStorge(MARKERS_KEY) || [];
    return _connectGoogleApi()
        .then(() => {

            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', gMap);
            addOnMapClickListener() /* ADD CLICK ON MAP LISTENER */
        })
}

function addOnMapClickListener() { /* ADD CLICK ON MAP LISTENER */
    let currPos;
    gMap.addListener('click', (mapsMouseEvent) => {
        currPos = mapsMouseEvent.latLng;
        addMarker(currPos);
        currMarker = currPos.toJSON()
        return currMarker;
    })
}

// let infoWindow;
// if (infoWindow) infoWindow.close();
// infoWindow = new google.maps.InfoWindow({
//     position: currPos
// });
// infoWindow.setContent(
//     JSON.stringify(currPos.toJSON(), null, 2)
// );
// infoWindow.open(gMap);
// var latLngToString = currPos.toJSON()
// console.log("latLngToString: ", latLngToString);
// gMarkers.push({ latLngToString });


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBFajncfvkDgcqw0yOp7UTzSUZQZ0CnjR0'
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}