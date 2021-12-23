// import { json } from "express/lib/response";

import { locService } from "./loc.service.js";

export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchAddress
}

const API_KEY = 'AIzaSyBFajncfvkDgcqw0yOp7UTzSUZQZ0CnjR0'
var gMap;
var gMarkers = [];

// var gMarkers = [];
// const MARKERS_KEY = 'markersDB';

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    // gMarkers = loadFromStorge(MARKERS_KEY) || [];
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            return gMap
        })
}


function searchAddress(address) {
    console.log(address)
        // searchedLocations = loadFromStorage(KEY) || [];
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => {
            // console.log('data from server', res.data)
            return res.data
        })
        .then((results) => {
            const address = {
                name: results.results[0].formatted_address,
                latLng: results.results[0].geometry.location
            }
            addMarker(address.latLng, address.name)
            panTo(address.latLng)
            locService.addLocToLocs(address);
            return address
        })
        .catch(err => {
            throw err
        });
}

function addMarker(loc, name) {
    clearLastMarker()
    getMarkerAddress(loc)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: name || 'clicked Location'
    });
    gMarkers.push(marker);
}

function getMarkerAddress(pos) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${API_KEY}`)
        .then(res => {
            console.log(res.data);
            return res.data
        })
        .then((value) => {
            const addressName = value.results[1].formatted_address;
            return addressName;
        })
}

function clearLastMarker() {
    for (let i = 0; i < gMarkers.length; i++) {
        gMarkers[i].setMap(null);
    }
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}