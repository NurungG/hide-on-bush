(function(exports) {
    function AppModel() {
        this.data = {};
        
        chrome.storage.sync.get(null, function(data) {
            this.data = data;
            /* TODO: render initial chips here? */
        }.bind(this));
    }

    AppModel.prototype = {
        getOnoffState : function(callback) {
            chrome.storage.sync.get("onoffState", function(data) {
                this.data.onoffState = data.onoffState;
                callback(data.onoffState);
            }.bind(this));
        },
        setOnoffState : function(value) {
            chrome.storage.sync.set({"onoffState": value});
        },
        getKeywordList : function(callback) {
            chrome.storage.sync.get("keywordList", function(data) {
                this.data.keywordList = data.keywordList;
                callback(data.keywordList);
            }.bind(this));
        },
        setKeywordList : function(value) {
            chrome.storage.sync.set({"keywordList": value});
        },
        getUserList : function(callback) {
            chrome.storage.sync.get("userList", function(data) {
                this.data.userList = data.userList;
                callback(data.userList);
            }.bind(this));
        },
        setUserList : function(value) {
            chrome.storage.sync.set({"userList": value});
        }
    }

    exports.AppModel = AppModel;
})(this);