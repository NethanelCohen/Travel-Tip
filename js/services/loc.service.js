export const locService = {
    getLocs,
    addAddressToLocs
}


const locs = [
    { id: 1, name: 'Greatplace', lat: 32.047104, lng: 34.832384, weather: 'hot' },
    { id: 2, name: 'Neveragain', lat: 32.047201, lng: 34.832581, weather: 'cold' }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs)
    });
}

function addAddressToLocs(loc) {
    console.log("loc: ", loc);
}