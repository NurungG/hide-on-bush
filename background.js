chrome.runtime.onInstalled.addListener(function() {
    /* Init the extension */
    chrome.storage.sync.set({'onoffState': false});
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
        id: 'context-menu-add-keyword',
        title: '\'%s\'를 키워드로 지정',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: 'context-menu-add-user',
        title: '\'%s\' 유저를 밴',
        contexts: ['selection'],
    });
    chrome.contextMenus.onClicked.addListener(contextMenusListener);
});

chrome.webNavigation.onCompleted.addListener(function(e) {
    chrome.storage.sync.get(null, function(d) { // null: get all data
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'op': 'page-load', 'data': d});
        });
    });
});

function contextMenusListener(info) {
    const itemId = info.menuItemId;
    const itemText = info.selectionText;

    switch (itemId) {
        case 'context-menu-add-keyword':
            chrome.storage.sync.get(['keywordList'], function(d) {
                let keywordSet = new Set(d.keywordList);
                if (keywordSet.has(itemText)) {
                    alert("A keyword \'" + itemText + "\' was already added");
                }
                keywordSet.add(itemText);
                chrome.storage.sync.set({keywordList: Array.from(keywordSet)});
                chrome.storage.sync.get(null, function(d) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {'op': 'item-add', 'data': d});
                    });
                });
            });
            break;
        case 'context-menu-add-user':
            chrome.storage.sync.get(['userList'], function(d) {
                let userSet = new Set(d.userList);
                if (userSet.has(itemText)) {
                    alert("A user \'" + itemText + "\' was already added");
                }
                userSet.add(itemText);
                chrome.storage.sync.set({userList: Array.from(userSet)});
                chrome.storage.sync.get(null, function(d) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {'op': 'item-add', 'data': d});
                    });
                });
            });
            break;
    }
}