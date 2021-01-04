// onoff toggle button click event
var on_off_btn = document.querySelector("input[name=on_off_btn]");

on_off_btn.addEventListener('change', function() {
    if(this.checked) {
      document.getElementById("off_text").style.display="none"
      document.getElementById("on_text").style.display="block"
    } else {
      document.getElementById("off_text").style.display="block"
      document.getElementById("on_text").style.display="none"
    }
})

// new code start
$(".add_form_field").on('mousedown', function(e) {
    $(this).toggleClass('active');
})

$(".add_form_field").on('mouseup', function(e) {
    $(this).children('input').focus()
    if (!$(this).hasClass('active')) {
        $(this).children('input').blur()
    }
})

$(".add_form_field input").on('focus', function(e) {
    if (!$(this).parent().hasClass('active')) {
        $(this).blur()
    }
})

$(".add_form_field input").on('blur', function(e) {
    $(this).val('');
    $(this).parent().removeClass('active')
})
// new code end


// footer tab click event
let footer_tab = document.getElementsByClassName("footer-tab");
console.log(footer_tab);
for (var i = 0; i < footer_tab.length; i++) {
    footer_tab[i].onclick = function() {
        /* TODO: load tab page */
    }
}
