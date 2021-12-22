import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.app = {
    onSearchAddress,
    onAddMarker,
    onPanTo,
    onGetLocs,
    onGetUserPos,
    renderLocationOnMap
}

function onInit() {
    mapService.initMap()
        .then(map => {
            onGetLocs(map)
            return map
        })
        .then(map => addOnMapClickListener(map) /* ADD CLICK ON MAP LISTENER */ )
        .catch(() => console.log('Error: cannot init map'));
}

function addOnMapClickListener(map) { /* ADD CLICK ON MAP LISTENER */
    let currPos;
    map.addListener('click', (mapsMouseEvent) => {
        currPos = mapsMouseEvent.latLng;
        var latLng = currPos.toJSON()
        var currMarker = {
            name: 'on map click',
            latLng
        }
        locService.addLocToLocs(currMarker);
        onAddMarker(currPos);
        return currMarker;
    })
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(pos, name) {
    console.log(pos)
    mapService.addMarker(pos, name);
    onGetLocs()
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

function onPanTo(lat = 35.6895, lng = 139.6917) {
    mapService.panTo(lat, lng);
}

function onSearchAddress(ev) {
    ev.preventDefault()
    const elInput = document.querySelector('.location-input')
    const value = elInput.value
    elInput.value = ''
    mapService.searchAddress(value)
        .then((value) => {
            onGetLocs()
            return value
        })
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
            <button class="table-go-btn" onclick="app.renderLocationOnMap(${loc.id})"> Go </button>
            <button class="remove-btn" onclick="app.onDeleteLocation(${loc.id})">X</button>
        </td>
    </tr>`
    })
    elSearchResults.innerHTML = strHTMLs.join('');
    return locs
}

function renderLocationOnMap(id) {
    const { lat, lng, name } = locService.getlocation(id)
    onAddMarker({ lat, lng }, name)
    onPanTo(lat, lng)
}

function rednerLoc(address) {
    document.querySelector('section h2').innerText = address.name
    return address
}