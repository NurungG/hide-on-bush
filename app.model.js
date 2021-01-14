(function(exports) {
    function AppModel(data) {
        this.data = data;
        this.data.keywordSet = new Set(this.data.keywordList);
        this.data.userSet = new Set(this.data.userList);
    }

    AppModel.prototype = {
        getOnoffState : function() {
            return this.data.onoffState;
        },
        setOnoffState : function(value) {
            chrome.storage.sync.set({"onoffState": value});
        },
        getKeywordList : function() {
            return this.data.keywordList;
        },
        getUserList : function() {
            return this.data.userList;
        },
        addItem : function(mode, item) {
            if (mode === 0) {
                this.addKeyword(item);
            } else if (mode === 1) {
                this.addUser(item);
            }
        },
        removeItem : function(mode, item) {
            if (mode === 0) {
                this.removeKeyword(item);
            } else if (mode === 1) {
                this.removeUser(item);
            }
        },
        addKeyword : function(keyword) {

        },
        removeKeyword : function(keyword) {
            this.keywordSet.delete(keyword);
            /* TODO: sync down to storage */
        },
        addUser : function(user) {

        },
        removeUser : function(user) {

        }
    }

    exports.AppModel = AppModel;
})(this);