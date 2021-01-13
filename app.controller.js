(function(exports) {
    function AppController() {
        this.model = new AppModel();
        this.view = new AppView();
        this.messenger = new AppMessenger();

        document.querySelector(".onoff-btn").addEventListener("change", this.onChangeToggleOnoff.bind(this));
    }

    AppController.prototype = {
        onChangeToggleOnoff : function(event) {
            let onoffBtn = event.target;
            this.view.toggleOnoffButton(onoffBtn);
            this.model.setOnoffState(onoffBtn.checked);
            this.messenger.sendOnoffState(onoffBtn.checked);
        },
    }

    exports.AppController = AppController;


    /* AppMessenger (temporally place it here) */
    function AppMessenger() {

    }

    AppMessenger.prototype = {
        sendMsgToContent : function(op) {
            
        },
        sendOnoffState : function(value) {

        }
    }

    exports.AppMessenger = AppMessenger;
})(this);