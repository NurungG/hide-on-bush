(function(exports) {
    /* This constructor should be run as a callback of chrome.storage get() api */
    function AppController(data) {
        this.mode = 0;

        this.model = new AppModel(data);
        this.view = new AppView();
        this.messenger = new AppMessenger();

        this.view.loadOnoffState(this.model.getOnoffState());
        this.view.renderChips(this.model.getKeywordList());

        document.querySelector(".onoff-btn").addEventListener("change", this.onChangeToggleOnoff.bind(this));

        let chipList = document.querySelectorAll(".chip");
        for (let chip of chipList) {
            chip.addEventListener("click", this.onClickRemoveChip.bind(this))
        }

        document.querySelector("#chip-add-btn").addEventListener(
            "mousedown", this.onClickOpenAddField.bind(this)
        );
        document.querySelector("#chip-add-btn input").addEventListener(
            "blur", this.onBlurCloseAddField.bind(this)
        );
        document.querySelector("#chip-add-btn input").addEventListener(
            "keypress", this.onEnterSubmitItem.bind(this)
        );
        document.querySelector("#chip-add-btn input").addEventListener(
            "input", this.onInputCheckLength.bind(this)
        );
    }

    AppController.prototype = {
        onChangeToggleOnoff : function(event) {
            let onoffBtn = event.target;
            this.view.toggleOnoffButton(onoffBtn);
            this.model.setOnoffState(onoffBtn.checked);
            this.messenger.sendOnoffState(onoffBtn.checked);
        },
        onClickRemoveChip : function(event) {
            let targetChip = event.target;
            let targetText = targetChip.innerText;
            this.view.removeChip(targetChip);
            this.model.removeItem(this.mode, targetText);
            this.messenger.sendRemovedItem(this.mode, targetText);
        },
        onClickOpenAddField : function(event) {
            let addField = document.querySelector("#chip-add-btn");
            this.view.openAddField(addField);
        },
        onBlurCloseAddField : function(event) {
            let addField = event.target.parentElement;
            this.view.closeAddField(addField);
        },
        onEnterSubmitItem : function(event) {
            if (event.keycode === 13) {
                event.preventDefault(); // what's this??
                this.view.removeBubble();

                let newItem = event.target.value;
                let errMsg = this.model.addNewItem(this.mode, newItem);
                if (errMsg) {
                    this.view.bubbleErrorMsg(errMsg);
                } else {
                    event.target.blur();
                }
            }
        },
        onInputCheckLength : function(event) {
            let input = event.target;
            this.view.removeBubble();

            input.value = checkTextLength(input.value);

            function checkTextLength(text) {
                var len = 0;
                for (var i = 0; i < text.length; i++){
                    if(escape(text.charAt(i)).length == 6) {
                        len++;
                    }
                    len++;
                    if(len > 34) {
                        //printErrorMsg("글자수 초과!")
                        return text.substring(0, i);
                    }
                }
                return text;
            }
        }
    }

    exports.AppController = AppController;


    /* AppMessenger (temporally place it here) */
    function AppMessenger() {

    }

    AppMessenger.prototype = {
        sendMsgToContent : function(op) {
            
        },
        sendOnoffState : function(value) {

        },
        sendRemovedItem : function(mode, value) {
            if (mode === 0) {
                this.sendRemovedKeyword(value);
            } else if (mode === 1) {
                this.sendRemovedUser(value);
            }
        },
        sendRemovedKeyword : function(value) {

        },
        sendRemovedUser : function(value) {

        },
    }

    exports.AppMessenger = AppMessenger;
})(this);