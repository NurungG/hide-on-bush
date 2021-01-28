document.addEventListener('DOMContentLoaded', function(e) {
    chrome.storage.sync.get(null, function(data) {
        app = new AppController(data);
    });
});

function sendMsgToContent(op) {
    chrome.storage.sync.get(null, function(d) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'op': op, 'data': d});
        });
    });
}

function saveChangesAtStorage() {
    if (mode == 0){
        chrome.storage.sync.set({'keywordList': Array.from(keywordList)}, function() {
            console.log("Changes saved at keywordList");
        });
    } else {
        chrome.storage.sync.set({'userList': Array.from(userList)}, function() {
            console.log("Changes saved at userList");
        });
    }
}