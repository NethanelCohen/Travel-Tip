export const locService = {
    getLocs,
    addLocToLocs,
    getlocation
}

var gNextId = 0;
const LOCS_KEY = 'locs_DB';

const locs = [
    { id: _makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, weather: 'hot' },
    { id: _makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, weather: 'cold' }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs)
    });
}

function getlocation(locationID) {
    return locs.find((loc) => loc.id === locationID);
}

function addLocToLocs(loc) {

    const isLocOnStorage = locs.find(address => {
        return loc.name === address.name;
    })
    if (isLocOnStorage) {
        console.log('From catch!!!', locs);
        isLocOnStorage.updatedAt = new Date();
        return loadFromStorage(LOCS_KEY)
    }
    locs.push({
        id: _makeId(),
        name: loc.name,
        lat: loc.latLng.lat,
        lng: loc.latLng.lng,
        weather: 'Not now',
        createdAt: new Date(),
        updatedAt: 0
    })
    console.log('New place...', locs);
    saveToStorage(LOCS_KEY, locs)
}

function _makeId() {
    return ++gNextId;
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}