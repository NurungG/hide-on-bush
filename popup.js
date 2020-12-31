// onoff toggle button click event
document.getElementById("onoff-input").onclick = function(element) {
    let onoff_btn = document.getElementById("onoff-btn");
    console.log(onoff_btn);
    if (onoff_btn.classList.contains("btn-off")) {
        onoff_btn.classList.remove("btn-off");
        onoff_btn.classList.add("btn-on");

        onoff_btn.getElementsByClassName("toggle-text")[0].innerHTML = "ON";
    } else {
        onoff_btn.classList.remove("btn-on");
        onoff_btn.classList.add("btn-off");

        onoff_btn.getElementsByClassName("toggle-text")[0].innerHTML = "OFF";
    }
};

// footer tab click event
let footer_tab = document.getElementsByClassName("footer-tab");
console.log(footer_tab);
for (var i = 0; i < footer_tab.length; i++) {
    footer_tab[i].onclick = function() {
        /* TODO: load tab page */
    }
}