(function(exports) {
    function AppModel(data) {
        this.data = data;
        this.data.keywordList = new Set(this.data.keywordList);
        this.data.userList = new Set(this.data.userList);
        this.data.currentFooterTabId = 0;
    }

    AppModel.prototype = {
        getOnoffState : function() {
            return this.data.onoffState;
        },
        setOnoffState : function(value) {
            chrome.storage.sync.set({"onoffState": value});
        },
        setCurrentFooterTabId : function(value) {
            this.data.currentFooterTabId = value;
        },
        getCurrentItems : function() {
            if (this.data.currentFooterTabId == 0) {
                return this.getKeywordList();
            } else if (this.data.currentFooterTabId == 1) {
                return this.getUserList();
            }
        },
        getMachtedItems : function(search) {
            let currentItems = this.getCurrentItems();
            let searchResult = [];
            for (let item of currentItems) {
                if (item.match(search)) {
                    searchResult.push(item);
                }
            }
            return searchResult;
        },
        getKeywordList : function() {
            return this.data.keywordList;
        },
        getUserList : function() {
            return this.data.userList;
        },
        addItem : function(item) {
            item = item.trim();
            if (item == "") {
                return "유효하지 않은 문자열입니다";
            }

            if (this.data.currentFooterTabId == 0) {
                return this.addKeyword(item);
            } else if (this.data.currentFooterTabId == 1) {
                return this.addUser(item);
            }
        },
        removeItem : function(item) {
            if (this.data.currentFooterTabId == 0) {
                return this.removeKeyword(item);
            } else if (this.data.currentFooterTabId == 1) {
                return this.removeUser(item);
            }
        },
        addKeyword : function(keyword) {
            if (this.data.keywordList.has(keyword)) {
                return "이미 존재합니다.";
            }
            this.data.keywordList.add(keyword);
            chrome.storage.sync.set({"keywordList": Array.from(this.data.keywordList)});
            return null;
        },
        removeKeyword : function(keyword) {
            this.data.keywordList.delete(keyword);
            chrome.storage.sync.set({"keywordList": Array.from(this.data.keywordList)});
        },
        addUser : function(user) {
            if (this.data.userList.has(user)) {
                return "이미 존재합니다.";
            }
            this.data.userList.add(user);
            chrome.storage.sync.set({"userList": Array.from(this.data.userList)});
            return null;
        },
        removeUser : function(user) {
            this.data.userList.delete(user);
            chrome.storage.sync.set({"userList": Array.from(this.data.userList)});
        }
    }

    exports.AppModel = AppModel;
})(this);