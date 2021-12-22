import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    console.log(mapService.currMarker);
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('.btn-get-locs')
    const value = elInput.value
    elInput.value = ''
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.saved-locations-container').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            return pos.coords
        })
        // Add marker and Pento when clicking "My location"
        .then(latLng => {
            mapService.addMarker({ lat: latLng.latitude, lng: latLng.longitude }); /* MARKER */
            mapService.panTo({ lat: latLng.latitude, lng: latLng.longitude }) /* PAN-TO */
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}