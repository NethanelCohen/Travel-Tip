import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.app = {
    onSearchAddress,
    onAddMarker,
    onPanTo,
    onGetLocs,
    onGetUserPos
}

function onInit() {
    mapService.initMap()
        .then(onGetLocs)
        .then()
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    // console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    console.log(mapService.currMarker);
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}


function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            if (!locs.length) return
            rednerLocs(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
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
    mapService.panTo(35.6895, 139.6917);
}

function onSearchAddress(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('.location-input')
    const value = elInput.value
    elInput.value = ''
    mapService.searchAddress(value)
        .then(rednerLoc)
}

function rednerLocs(locs) {
    const elSearchResults = document.querySelector('.saved-locations-container');
    var strHTMLs = locs.map(loc => {
        return `<tr>
        <td>${loc.name}</td>
        <td>${loc.lat}</td>
        <td>${loc.lng}</td>
        <td>${loc.weather}</td>
        <td>
            <button class="table-go-btn" onclick="onGoTable('${loc.id}')"> Go </button>
            <button class="remove-btn" onclick="onDeleteLocation('${loc.id}')">X</button>
        </td>
    </tr>`
    })
    elSearchResults.innerHTML = strHTMLs.join('');
}

function rednerLoc(address) {
    document.querySelector('section h2').innerText = address.name
        // return address
}