var expectedFiles = -1;
var dataIndex = [];
var files = {};

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

var colorOrder = ['red', 'blue', 'orange', 'purple'];

var domDataKeys = {
    'Symptomatic Cases': 'symptomatic',
    'Exposures to Positive Cases': 'exposures',
    'Positive Cases': 'confirmed'
};

$.ajax({
    url: 'data/index.json',
    type: 'GET',
    dataType: 'json'
}).done(function(json) {
    dataIndex = json.map(x => x.replace('.json', ''));
    expectedFiles = json.length;
    for(let i = 0; i < json.length; i++) {
        const fileName = json[i];
        const date = fileName.replace('.json', '');
        $.ajax({
            url: `data/${fileName}`,
            type: 'GET',
            dataType: 'json'
        }).done(function(data) {
            files[date] = data;
        });
    }
}).fail(function(xhr, status, errorThrown) {
    console.log('index.json request failed.')
});

function indexes(a, b) {
    var result = dataIndex.indexOf(b) - dataIndex.indexOf(a);
    console.log(a, b, result)
    return result;
}

function getAvailableDates() {
    return Object.keys(files).filter(fileName => fileName !== 'index').sort(indexes);
}

function getData(data, key) {
    const availableDates = getAvailableDates();
    const result = new Array(availableDates.length);

    for(let i = 0; i < availableDates.length; i++) {
        result[i] = data[availableDates[i]][key].cases;
    }

    return result;
}

function buildCharts(category, data) {
    var availableDates = getAvailableDates();
    var fields = ['Students', 'Staff', 'Total'];
    var chartData = {
        type: 'line',
        data: {
            labels: availableDates,
            datasets: []
        }
    };

    for(let i = 0; i < fields.length; i++) {
        const key = fields[i];
        const dataset = {
            label: key,
            backgroundColor: chartColors[colorOrder[i]],
            borderColor: chartColors[colorOrder[i]],
            data: getData(data, fields[i]),
            fill: false
        };

        chartData.data.datasets.push(dataset);
    }

    var element = document.createElement('CANVAS');
    var ctx = element.getContext('2d');

    new Chart(ctx, chartData);

    document.getElementById(domDataKeys[category]).appendChild(element)
}

function buildCategory(category) {
    var availableDates = getAvailableDates();

    var sortedData = {};

    for(let i = 0; i < availableDates.length; i++) {
        const currentDate = availableDates[i];
        sortedData[currentDate] = files[currentDate][category]
    }

    buildCharts(category, sortedData);
}

function buildPage() {
    var categories = Object.keys(domDataKeys);
    for(let i = 0; i < categories.length; i++) {
        buildCategory(categories[i]);
    }
}

const awaitResponses = setInterval(function() {
    if (expectedFiles > 0 && expectedFiles === Object.keys(files).length) {
        console.log('All COVID data received.');
        clearInterval(awaitResponses);
        console.log(files)
        buildPage();
    } else {
        console.log(`Still waiting for COVID data files... ${Object.keys(files).length}/${expectedFiles}`)
    }
}, 100);
