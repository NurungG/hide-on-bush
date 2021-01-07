chrome.runtime.onInstalled.addListener(function() {
    /* Init the extension */
    chrome.storage.sync.set({'onoff':false});
    chrome.storage.sync.set({'keywordList':['Hi!', 'This is Hide-on-bush', 'We love Faker']});
    chrome.storage.sync.set({'userBlackList':['Faker', 'Hide on bush', 'T1 Faker']});
});

chrome.webNavigation.onCompleted.addListener(function(e) {
    chrome.storage.sync.get(null, function(d) { // null: get all data
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'op': 'page-load', 'data': d});
        });
    });
});
