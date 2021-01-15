(function(exports) {
    function AppView() {}

    AppView.prototype = {
        /* onoff button */
        loadOnoffState : function(onoffState) {
            let onoffBtn = document.querySelector("#onoff-btn");
            onoffBtn.checked = onoffState;
            this.toggleOnoffButton(onoffBtn);
        },
        activateButtonSwiping : function() {
            document.querySelector("#onoff-label").classList.add("active");
        },
        toggleOnoffButton : function(onoffBtn) {
            let onoffText = document.querySelector("#onoff-text");
            if (onoffBtn.checked) {
                onoffText.classList.replace("off", "on");
                onoffText.innerText = "ON";
            } else {
                onoffText.classList.replace("on", "off");
                onoffText.innerText = "OFF";
            }
        },
        /* search bar */
        toggleButtons : function() {
            let clearBtn = document.querySelector("#clear-btn");
            let searchBar = document.querySelector("#search-bar");
            let addBtn = document.querySelector("#chip-add-btn");

            if (searchBar.value) {
                clearBtn.style.display = "inline";
                addBtn.style.display = "none";
            } else {
                clearBtn.style.display = "none";
                addBtn.style.display = "block";
            }
        },
        resetSearchBar : function() {
            document.querySelector("#search-bar").value = null;
            document.querySelector("#clear-btn").style.display = "none";
        },
        /* chips */
        addChip : function(item) {
            let newChip = document.createElement("button");
            newChip.innerText = item;
            newChip.classList.add("chip");
            document.querySelector(".chips-wrapper").appendChild(newChip);
            return newChip;
        },
        renderChips : function(itemList) {
            for (let item of itemList) {
                this.addChip(item);
            }
        },
        renderInitialChips : function(itemList) {
            document.querySelector("#chip-add-btn").style.display = "block";
            for (let item of itemList) {
                this.addChip(item);
            }
        },
        removeAllChips : function() {
            let chipList = document.querySelectorAll(".chip");
            for (let chip of chipList) {
                chip.remove();
            }
        },
        removeChip : function(chip) {
            chip.remove();
        },
        openAddField : function(field) {
            field.classList.add("active");
            field.querySelector("input").focus();
        },
        closeAddField : function(field) {
            field.classList.remove("active");
            field.querySelector("input").value = "";
            this.removeBubble();
        },
        /* bubble */
        bubbleErrorMsg : function(msg) {
            /* TODO: change it to vanila js */
            let form = $(".add_chips_back");
            let item = form.first();
            let node = item.get(0);
            let pos = item.position();
            let bubble = $('<span/>').html('<span class="formHintBubble" style="left: '
                            + pos.left + 'px; top: ' + pos.top + 'px;">'
                            + '<i class="fas fa-exclamation-triangle"></i> '
                            + msg + '</span>').contents();
            bubble.insertAfter($(".chips-wrapper"));
        },
        removeBubble : function() {
            let bubble = document.querySelector(".formHintBubble");
            if (bubble) {
                bubble.remove();
            }
        },
        /* tab */
        activateFooterTab : function(target) {
            if (target.classList.contains("active")) {
                return false;
            }
            let footerTabList = document.querySelectorAll(".footer-tab");
            for (let footerTab of footerTabList) {
                footerTab.classList.remove("active");
            }
            target.classList.add("active");
            return true;
        }
    }

    exports.AppView = AppView;
})(this);