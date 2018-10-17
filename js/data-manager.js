let coords;

let fileUpload = document.getElementById('fileUpload');
fileUpload.onchange = parseFile;
let inputSampleSize = document.getElementById('inputSampleSize');
inputSampleSize.value = 5;
inputSampleSize.onchange = updateFilters;

let sampleSize = inputSampleSize.value;

function updateFilters() {
    sampleSize = parseInt(inputSampleSize.value);
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
    });
}

function filterMedian() {
    return filterForEach(coords['phone'], function (sampleArray) {
        sampleArray.sort();
        let half = Math.floor(sampleArray.length / 2);
        if (sampleArray.length % 2) {
            return sampleArray[half];
        }
        return (sampleArray[half - 1] + sampleArray[half]) / 2.0;
    });
}

function filterForEach(originalCoords, filter) {
    let filteredCoords = JSON.parse(JSON.stringify(originalCoords)); // for copying the 2d structure
    for (let column = 0; column < originalCoords[0].length; column++) { // columns in outer loop, since we process all x values then all y values
        for (let row = sampleSize; row < originalCoords.length; row++) { // start row at sample size, since we only sample backwards
            let sampleArray = [];
            for (let rowOffset = row - sampleSize; rowOffset <= row; rowOffset++) { // rowOffset can never be smaller than 0
                sampleArray.push(originalCoords[rowOffset][column]);
            }

            let filterValue = filter(sampleArray);
            filteredCoords[row][column] = filterValue;
        }
    }
    return filteredCoords;
}

