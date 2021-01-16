(function(exports) {
    /* This constructor should be run as a callback of chrome.storage get() api */
    function AppController(data) {
        this.model = new AppModel(data);
        this.view = new AppView();
        this.messenger = new AppMessenger();

        this.view.loadOnoffState(this.model.getOnoffState());
        this.view.renderInitialChips(this.model.getCurrentItems());

        document.querySelector("#onoff-btn").addEventListener(
            "change", this.onChangeToggleOnoff.bind(this)
        );

        document.querySelector("#search-bar").addEventListener(
            "input", this.onInputSearch.bind(this)
        )
        document.querySelector("#clear-btn").addEventListener(
            "click", this.onClickClearSearchBar.bind(this)
        )

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

        let footerTabList = document.querySelectorAll(".footer-tab");
        for (let footerTab of footerTabList) {
            footerTab.addEventListener(
                "click", this.onClickSwitchFooterTab.bind(this)
            );
        }
    }

    AppController.prototype = {
        onChangeToggleOnoff : function(event) {
            let onoffBtn = event.target;
            this.view.activateButtonSwiping();
            this.view.toggleOnoffButton(onoffBtn);
            this.model.setOnoffState(onoffBtn.checked);
            this.messenger.sendOnoffState(onoffBtn.checked);
        },
        onInputSearch : function(event) {
            let nowSearch = event.target.value;
            this.view.toggleButtons();
            this.view.removeAllChips();
            this.view.renderChips(this.model.getMachtedItems(nowSearch));
        },
        onClickClearSearchBar : function(event) {
            this.view.resetSearchBar();
            this.view.removeAllChips();
            this.view.renderInitialChips(this.model.getCurrentItems());
        },
        onClickRemoveChip : function(event) {
            let targetChip = event.target;
            let targetText = targetChip.innerText;
            this.view.removeChip(targetChip);
            this.model.removeItem(targetText);
            this.messenger.sendRemovedItem(targetText);
        },
        onClickOpenAddField : function(event) {
            let addField = document.querySelector("#chip-add-btn");
            if (!addField.classList.contains("active")) {
                event.preventDefault(); // somewhat tricky way...
                // When i click an icon inside, it propagates a blur event.
                // So this add field is not opened.
                // fix it later... with awesome solutions...
            }
            this.view.openAddField(addField);
        },
        onBlurCloseAddField : function(event) {
            let addField = event.target.parentElement;
            this.view.closeAddField(addField);
        },
        onEnterSubmitItem : function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();

                this.view.removeBubble();

                let newItem = event.target.value;
                let errMsg = this.model.addItem(newItem);
                if (errMsg) {
                    this.view.bubbleErrorMsg(errMsg);
                } else {
                    this.view.addChip(newItem).addEventListener(
                        "click", this.onClickRemoveChip.bind(this)
                    );
                    this.messenger.sendAddedItem(newItem);

                    event.target.blur(); 
                }
            }
        },
        onInputCheckLength : function(event) {
            let input = event.target;
            this.view.removeBubble();

            let ret = limitTextLength(input.value);
            input.value = ret.text;

            if (ret.errMsg) {
                this.view.bubbleErrorMsg(ret.errMsg);
            }

            function limitTextLength(text) {
                let len = 0;
                for (let i = 0; i < text.length; i++){
                    if(escape(text.charAt(i)).length == 6) {
                        len++;
                    }
                    len++;
                    if(len > 34) {
                        return {
                            "text": text.substring(0, i),
                            "errMsg": "글자수 초과!"
                        };
                    }
                }
                return {"text": text};
            }
        },
        onClickSwitchFooterTab : function(event) {
            let targetFooterTab = event.target;

            if (!this.view.activateFooterTab(targetFooterTab)) {
                return; // case of already "active"
            }
            
            this.model.setCurrentFooterTabId(targetFooterTab.getAttribute("index"));

            this.view.removeAllChips();
            this.view.resetSearchBar();
            this.view.renderInitialChips(this.model.getCurrentItems());
        }
    }

    exports.AppController = AppController;
})(this);