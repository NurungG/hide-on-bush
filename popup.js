// onoff toggle button click event
function toggleBtn(btn) {
    let onoffText = document.getElementById("onoff-text");
    if (btn.checked) {
        onoffText.setAttribute("class", "onoff-text-on")
        onoffText.innerHTML = "ON";
        chrome.storage.sync.set({"onoff": true});
    } else {
        onoffText.setAttribute("class", "onoff-text-off")
        onoffText.innerHTML = "OFF";
        chrome.storage.sync.set({"onoff": false});
    }
};

var onoffBtn = document.querySelector("input[name=onoff-btn]");

chrome.storage.sync.get(['onoff'], function(data) {
    onoffBtn.checked = data.onoff;
    toggleBtn(onoffBtn);
});

onoffBtn.addEventListener('change', function() {
    toggleBtn(this);
});

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

function arraysEqual(arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1 == null || arr2 == null) return false;
    if (arr1.length != arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Search bar keyup event
let keywords = [];
let prevKeyword = "";
let prevSearched = [];
document.querySelector("input[name=keyword-searcher]").addEventListener('keyup', function(event) {
    let searchString = event.target.value;
    if (prevKeyword === searchString) {
        return;
    }
    prevKeyword = searchString;

    let chipsPlate = document.getElementById("keyword-chips");

    let matchedKeywords = [];
    chrome.storage.sync.get(['wordList'], function(data) {
        keywords = data.wordList;

        for (let i = 0; i < keywords.length; i++) {
            if (keywords[i].match(searchString)) {
                matchedKeywords.push(keywords[i]);
            }
        }

        if (arraysEqual(prevSearched, matchedKeywords)) {
            return;
        }

        let childs = chipsPlate.querySelectorAll(".chip");
        console.log(childs);
        for (let i = 1; i < childs.length; i++) {
            chipsPlate.removeChild(childs[i]);
        }

        if (keywords.length === matchedKeywords.length) {
            document.getElementById("chip-add-btn").style.display = "block";
        } else {
            document.getElementById("chip-add-btn").style.display = "none";
        }

        for (let i = 0; i < matchedKeywords.length; i++) {
            let node = document.createElement("div");
            node.appendChild(document.createTextNode(matchedKeywords[i]));
            node.setAttribute("class", "chip");
            chipsPlate.appendChild(node);
        }

        prevSearched = matchedKeywords;
    });
});

chrome.storage.sync.get(['wordList'], function(data) {
    let keywords = data.wordList;
    let chipsPlate = document.getElementById("keyword-chips");
    for (let i = 0; i < keywords.length; i++) {
        let node = document.createElement("div");
        node.appendChild(document.createTextNode(keywords[i]));
        node.setAttribute("class", "chip");
        chipsPlate.appendChild(node);
    }
});

// Add button event
flag = false;
document.querySelector(".chip.add-btn").addEventListener('click', function(event) {
    /* TODO!! */
    console.log("TODO");

    if (flag) return;
    
    $("#add-icon").css('display', 'none');
    $(".chip.add-btn").append('<input type="text" id="new-keyword" name="new-keyword">');

    $("#new-keyword").on('keydown', function(event) {
        let value = $("#new-keyword").val();

        $(".chip.add-btn").append('<div id="virtual-dom">'+value+'</div>');
        let inputWidth = $("#virtual-dom").width() + 10;
        $("#new-keyword").css('width', inputWidth);

        $("#virtual-dom").remove();
    });

    /* let addBtn = $(event.target);

    addBtn.empty();
    addBtn.append('<input type="text" id="new-keyword">');

    $("#new-keyword").on('keydown', function(event) {
        let value = $("#new-keyword").val();

        addBtn.append('<div id="virtual-dom">' + value + '</div');

        let inputWidth = $("#virtual-dom").width() + 10;

        $("#new-keyword").css('width', inputWidth);
        $('#virtual-dom').remove();
    }); */
});