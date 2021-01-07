chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
});

chrome.storage.sync.set({onoff: false});

chrome.storage.sync.set({'keywordList': ["hi", "hello", "idontwannasee", "text blind"]}, function() {
    console.log("value set");
});

chrome.storage.sync.set({'userBlackList': ["jinwook bae", "hwichance ji", "hwichance", "nurungg"]}, function() {
    console.log("value set");
});
