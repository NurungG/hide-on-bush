chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
});

chrome.storage.sync.set({onoff: false});

chrome.storage.sync.set({'keywordList': ["hi", "hello", "jinwook bae", "hwichance ji", "idontwannasee", "text blind"]}, function() {
    console.log("value set");
});
