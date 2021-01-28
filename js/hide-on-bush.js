document.addEventListener('DOMContentLoaded', function(e) {
    chrome.storage.sync.get(null, function(data) {
        app = new AppController(data);
    });
});