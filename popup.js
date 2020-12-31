// onoff toggle button click event
var on_off_btn = document.querySelector("input[name=on_off_btn]");

on_off_btn.addEventListener('change', function() {
    if(this.checked) {
      document.getElementsByClassName("on_off_text")[0].innerHTML = "ON";
    } else {
      document.getElementsByClassName("on_off_text")[0].innerHTML = "OFF";
    }
})

// footer tab click event
let footer_tab = document.getElementsByClassName("footer-tab");
console.log(footer_tab);
for (var i = 0; i < footer_tab.length; i++) {
    footer_tab[i].onclick = function() {
        /* TODO: load tab page */
    }
}
