chrome.runtime.onInstalled.addListener(function() {
    /* Init the extension */
    chrome.storage.sync.set({'onoff':false});
    chrome.storage.sync.get(['keywordList'], function(d) {
        if (!d.keywordList) {
            chrome.storage.sync.set({'keywordList':['Hi!', 'This is Hide-on-bush', 'We love Faker']});
        }
    });
    chrome.storage.sync.get(['userList'], function(d) {
        if (!d.userList) {
            chrome.storage.sync.set({'userList':['Faker', 'Hide on bush', 'T1 Faker']});
        }
    });


    // Add context menu
    chrome.contextMenus.create({
        id: 'Add as keyword',
        title: '키워드로 지정',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: 'Add as user blacklist',
        title: '유저 밴',
        contexts: ['selection'],
    });
    chrome.contextMenus.onClicked.addListener = function(e) {
        console.log("context menu clicked:", e);
    }
});

chrome.webNavigation.onCompleted.addListener(function(e) {
    chrome.storage.sync.get(null, function(d) { // null: get all data
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'op': 'page-load', 'data': d});
        });
    });
});
