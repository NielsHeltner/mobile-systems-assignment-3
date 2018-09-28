let coords;

let fileUpload = document.getElementById('fileUpload');
fileUpload.onchange = parseFile;
let inputSampleSize = document.getElementById('inputSampleSize');
inputSampleSize.value = 2;
inputSampleSize.onchange = updateFilters;
let inputThreshold = document.getElementById('inputThreshold');
inputThreshold.value = 0.00001;
inputThreshold.onchange = updateFilters;

let sampleSize = inputSampleSize.value;
let threshold = inputThreshold.value;

function updateFilters() {
    sampleSize = parseInt(inputSampleSize.value);
    threshold = parseFloat(inputThreshold.value);
    coords['mean'] = filterMean();
    coords['median'] = filterMedian();
    drawFilter(coords);
}

function parseFile() {
    coords = {
        'gt': [],
        'phone': []
    };
    let file = fileUpload.files[0];
    Papa.parse(file, {
        complete: extractCoords
    });
}

function extractCoords(parsedData) {
    let data = parsedData.data;
    for (row = 1; row < data.length - 1; row++) { // skip first row since it's header text, skip last row since it's empty
        coords['gt'].push([parseFloat(data[row][1]), parseFloat(data[row][2])]);
        coords['phone'].push([parseFloat(data[row][3]), parseFloat(data[row][4])]);
    }

    drawRaw(coords);
    updateFilters();
}

function filterMean() {
    return filterForEach(coords['phone'], function (sampleArray) {
        let sum = sampleArray.reduce((a, b) => a + b, 0);
        let mean = sum / sampleArray.length;
        return mean;
    });//biking = 8, waling = 50+
}

function filterMedian() {
    return filterForEach(coords['phone'], function (sampleArray) {
        sampleArray.sort();
        var half = Math.floor(sampleArray.length / 2);
        if (sampleArray.length % 2) {
            return sampleArray[half];
        }
        else
            return (sampleArray[half - 1] + sampleArray[half]) / 2.0;
    });
}

function filterForEach(originalCoords, filter) {
    let filteredCoords = JSON.parse(JSON.stringify(originalCoords));
    for (let column = 0; column < filteredCoords[0].length; column++) {
        for (let row = 0; row < filteredCoords.length; row++) {
            let sampleArray = [];
            for (let rowOffset = row - sampleSize < 0 ? 0 : row - sampleSize; rowOffset < row + sampleSize && rowOffset < filteredCoords.length; rowOffset++) {
                sampleArray.push(filteredCoords[rowOffset][column]);
            }

            let filterValue = filter(sampleArray);
            let originalValue = filteredCoords[row][column];
            if (Math.abs(originalValue - filterValue) > threshold) {
                filteredCoords[row][column] = filterValue;
            }
        }
    }
    return filteredCoords;
}

