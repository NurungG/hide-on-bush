(function(exports) {
    function AppMessenger() {}

    AppMessenger.prototype = {
        sendMsgToContent : function(opCode) {
            chrome.storage.sync.get(null, function(data) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {'op': opCode, 'data': data});
                });
            });
        },
        sendOnoffState : function(onoffState) {
            if (onoffState) {
                this.sendMsgToContent("switch-on");
            } else {
                this.sendMsgToContent("switch-off");
            }
        },
        sendAddedItem : function(value) {
            this.sendMsgToContent("item-add")
        },
        sendRemovedItem : function(value) {
            this.sendMsgToContent("item-remove")
        },
    }

    exports.AppMessenger = AppMessenger;
})(this);