(function(exports) {
    function AppView() {}

    AppView.prototype = {
        loadOnoffState : function(onoffState) {
            let onoffBtn = document.querySelectorAll("#onoff-btn");
            onoffBtn.checked = onoffState;
            this.toggleOnoffButton(onoffBtn);
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
        renderChips : function(itemSet) {
            for (let item of itemSet) {
                let newChip = document.createElement("button");
                newChip.innerText = item;
                newChip.classList.add("chip");

                document.querySelector(".chips-wrapper").appendChild(newChip);
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
        /* TODO: more view methods here */
    }

    exports.AppView = AppView;
})(this);