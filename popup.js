$("#goto_blocked_keywords_list").click(function() {
    document.body.innerHTML = "";

    $('body').animate({height:"300px"});

    setTimeout(function() {
        $('body').load("list.html");
    }, 300);

});