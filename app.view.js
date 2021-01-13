(function(exports) {
    function AppView() {}

    AppView.prototype = {
        toggleOnoffButton : function(onoffBtn) {
            let onoffText = document.querySelector("#onoff-text");
            if (onoffBtn.checked) {
                onoffText.classList.toggle("onoff-text-on");
                onoffText.innerText = "ON";
            } else {
                onoffText.classList.toggle("onoff-text-off");
                onoffText.innerHTML = "OFF";
            }
        },
        renderChips : function(chipPlate, itemList) {
            for (let item of itemList) {
                let newChip = document.createElement("button");
                newChip.addEventListener("click", chipClickListener);
                newChip.innerText = item;
                newChip.classList.add("chip");

                chipPlate.appendChild(newChip);
            }
        },
        /* TODO: more view methods here */
    }

    exports.AppView = AppView;
})(this);