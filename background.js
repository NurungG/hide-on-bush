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
        title: '\'%s\' 키워드 등록',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: 'context-menu-add-user',
        title: '\'%s\' 유저 등록',
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
    let itemText = info.selectionText;

    if (!checkTextLength(itemText)) {
        console.log(itemText);
        alert("글자수 초과!");
        return;
    }

    switch (itemId) {
        case 'context-menu-add-keyword':
            chrome.storage.sync.get(['keywordList'], function(d) {
                let keywordSet = new Set(d.keywordList);
                if (keywordSet.has(itemText)) {
                    alert("\'" + itemText + "\' 키워드는 이미 등록되어 있습니다.");
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
                    alert("\'" + itemText + "\' 유저는 이미 등록되어 있습니다.");
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

    function checkTextLength(text) {
        let len = 0;
        for (let i = 0; i < text.length; i++){
            if(escape(text.charAt(i)).length == 6) {
                len++;
            }
            len++;
            if(len > 34) {
                return false;
            }
        }
        return true;
    }
}