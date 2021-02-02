const workshopLinkTemplate = 'https://steamcommunity.com/sharedfiles/filedetails/?id='

var jsoned = null;
var imported = null;

function getID(fileName) {
    const pattern = /.*?_(\d+).gma/;
    return fileName.match(pattern)[1];
}

function updateString() {
    if(jsoned === null) {
        alert('Please upload your Workshop Folder first.');
        return false;
    } else {
        document.querySelector('#stringCopy').value = jsoned;
        return true;
    }
}

function copyText() {
    var stringCopy = document.querySelector('#stringCopy');
    stringCopy.select();
    document.execCommand('copy');
}

document.querySelector('#folderUpload').addEventListener('input', function(e) {
    const fileNames = [];
    for (let i = 0; i < this.files.length; i++) {
        fileNames.push(this.files.item(i).name);
    }

    jsoned = JSON.stringify(fileNames.map(getID));
    updateString();
});

$('#copyText').click(function() {
    var value = $('#stringCopy').val();
    if(value === '') {
        alert('No files have been uploaded. Please upload files and try again.');
    } else {
        try {
            JSON.parse(value);
            copyText();
        } catch(e) {
            if(updateString()) {
                $(this).click();
            }
        }
    }
});

$('#findFiles').click(function() {
    try {
        imported = JSON.parse($('#stringInput').val());

        $('.js-added-item').remove();
        $('#noFiles').hide();

        for (let i = 0; i < imported.length; i++) {
            if ((jsoned || []).indexOf(imported[i]) !== -1) {
                console.log();
                continue;
            }

            var listItem = document.createElement('LI');
            listItem.classList.add('list-group-item', 'js-added-item');

            var link = document.createElement('A');
            var href = `${workshopLinkTemplate}${imported[i]}`;
            link.href = href;
            link.innerText = href;

            listItem.appendChild(link);
            document.querySelector('#linkList').appendChild(listItem);
        }

        console.log($('#linkList').children().length)

        if ($('#linkList').children().length === 1) {
            $('#noFiles').show();
        }
    } catch(e) {
        console.error(e)
        alert('Invalid JSON formatting. Check your Workshop string and try again.');
    }
});
