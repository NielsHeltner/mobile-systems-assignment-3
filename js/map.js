var map = L.map('map', {
    center: [56.164, 10.197],
    zoom: 13  // from 1 to 18
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibmhlbHQxNSIsImEiOiJjam1peG0zYXUwOTRqM3dxcTRvMGF3aXpmIn0.4tE0Z9AzPQxGlr9mRsoQiQ'
}).addTo(map);

map.addEventListener('click', function(e) {
   alert(e.latlng.lat + ' - ' + e.latlng.lng);
});

map.addEventListener('mousemove', function(e) {
    document.getElementById("lat").innerHTML = e.latlng.lat;
    document.getElementById("lon").innerHTML = e.latlng.lng;
 });


let layerGt = [];
let layerPhone = [];
let layerMean = [];
let layerMedian = [];

let checkBoxGt = document.getElementById("checkBoxGt");
let checkBoxPhone = document.getElementById("checkBoxPhone");
let checkBoxMean = document.getElementById("checkBoxMean");
let checkBoxMedian = document.getElementById("checkBoxMedian");

checkBoxGt.onchange = toggleGt;
checkBoxPhone.onchange = togglePhone;
checkBoxMean.onchange = toggleMean;
checkBoxMedian.onchange = toggleMedian;

function toggleGt() {
    toggle(layerGt, this.checked);
}

function togglePhone() {
    toggle(layerPhone, this.checked);
}

function toggleMean() {
    toggle(layerMean, this.checked);
}

function toggleMedian() {
    toggle(layerMedian, this.checked);
}

function toggle(collection, checked) {
    if(checked) {
        add(collection);
    }
    else {
        remove(collection);
    }
}

function add(collection) {
    for(i = 0; i < collection.length; i++) {
        collection[i].addTo(map);
    }
}

function remove(collection) {
    for(i = 0; i < collection.length; i++) {
        map.removeLayer(collection[i]);
    }
}

function clearRaw() {
    remove(layerGt);
    remove(layerPhone);
    layerGt = [];
    layerPhone = [];
}

function clearFilter() {
    remove(layerMean);
    remove(layerMedian);
    layerMean = [];
    layerMedian = [];
}

function drawRaw(coords) {
    clearRaw();

    drawPolyline(coords, 'gt', layerGt, 'red', 10, 1);
    drawPolyline(coords, 'gt', layerGt, 'salmon', 5, 1);
    drawPolyline(coords, 'phone', layerPhone, 'blue', 10, 0.6);
    let routeToFitMapBy = drawPolyline(coords, 'phone', layerPhone, 'lightblue', 5, 0.6);
    map.fitBounds(routeToFitMapBy.getBounds());

    checkCheckBoxes();
}

function drawFilter(coords) {
    clearFilter();
    
    drawPolyline(coords, 'mean', layerMean, 'green', 10, 0.6);
    drawPolyline(coords, 'mean', layerMean, 'lightgreen', 5, 0.6);
    drawPolyline(coords, 'median', layerMedian, 'yellowgreen', 10, 0.6);
    drawPolyline(coords, 'median', layerMedian, 'yellow', 5, 0.6);

    checkCheckBoxes();
}

function drawPolyline(coords, type, layer, color, weight, opacity) {
    let route = L.polyline(coords[type], {
        color: color, 
        weight: weight, 
        opacity: opacity
    });
    layer.push(route);
    return route;
}

function checkCheckBoxes() {
    checkBoxGt.checked = true;
    checkBoxPhone.checked = true;
    checkBoxMean.checked = true;
    checkBoxMedian.checked = true;
    checkBoxGt.onchange();
    checkBoxPhone.onchange();
    checkBoxMean.onchange();
    checkBoxMedian.onchange();
}
