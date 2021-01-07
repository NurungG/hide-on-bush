var keywordList;
var chipsPlate;

// Popup load
document.addEventListener('DOMContentLoaded', function(e) {
    // get onoff status
    chrome.storage.sync.get(['onoff'], function(d) {
        let onoffBtn = document.querySelector("#onoff-btn");
        onoffBtn.checked = d.onoff;
        toggleBtn(onoffBtn);

        onoffBtn.addEventListener('change', function(e) {
            toggleBtn(this);
        });
    });

    // get keyword list
    chrome.storage.sync.get(['keywordList'], function(d) {
        keywordList = new Set(d.keywordList);
        chipsPlate = document.getElementById("keyword-chips");
        for (let keyword of keywordList) {
            let node = document.createElement("button");
            node.addEventListener('click', chipsClickListener);
            node.innerText = keyword;
            node.setAttribute("class", "chip");

            chipsPlate.appendChild(node);
        }
    })
});

function sendMsgToContent(op) {
    chrome.storage.sync.get(null, function(d) {
        console.log(d);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'op': op, 'data': d});
        });
    });
}

function toggleBtn(btn) {
    let onoffText = document.getElementById("onoff-text");
    if (btn.checked) {
        onoffText.setAttribute("class", "onoff-text-on")
        onoffText.innerHTML = "ON";
        chrome.storage.sync.set({'onoff': true});
        sendMsgToContent('switch-on');
    } else {
        onoffText.setAttribute("class", "onoff-text-off")
        onoffText.innerHTML = "OFF";
        chrome.storage.sync.set({'onoff': false});
        sendMsgToContent('switch-off');
    }
};

function chipsClickListener(e) {
    keywordList.delete($(this).text());
    chipsPlate.removeChild(this);
    saveChangesAtStorage();
    sendMsgToContent('keyword-delete');
}

// add chips btn click event
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

$(".add_form_field input").keypress(function(e) {
    if(event.keyCode === 13) {
        e.preventDefault();
        let newKeyword = $(this).val();
        addNewKeyword(newKeyword);
        $(this).blur();
    }
})

function addNewKeyword(newKeyword) {
    if(keywordList.has(newKeyword)) {
        alert('Keyword already added');
    } else {
        keywordList.add(newKeyword);
        let node = document.createElement("button");
        node.addEventListener('click', chipsClickListener);
        node.innerText = newKeyword;
        node.setAttribute("class", "chip");
        chipsPlate.appendChild(node);
        saveChangesAtStorage();
        sendMsgToContent('keyword-add');
    }
}

function saveChangesAtStorage() {
    chrome.storage.sync.set({'keywordList': Array.from(keywordList)}, function() {
        console.log("Changes saved");
    });
}

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
let prevKeyword = "";
let prevSearched = [];
document.querySelector("input[name=keyword-searcher]").addEventListener('keyup', function(event) {
    let searchString = event.target.value;
    if (prevKeyword === searchString) {
        return;
    }
    prevKeyword = searchString;

    let matchedKeywords = [];

    // find matched keywords
    for (let keyword of keywordList) {
        if (keyword.match(searchString)) {
            matchedKeywords.push(keyword);
        }
    }

    // if completely equal, skip it
    if (arraysEqual(prevSearched, matchedKeywords)) {
        return;
    }

    // remove chips
    let childs = chipsPlate.querySelectorAll(".chip");
    for (let i = 0; i < childs.length; i++) {
        chipsPlate.removeChild(childs[i]);
    }

    // show or hide add button
    if (keywordList.size === matchedKeywords.length) {
        document.getElementById("chip-add-btn").style.display = "block";
    } else {
        document.getElementById("chip-add-btn").style.display = "none";
    }

    // re-generate chips
    for (let i = 0; i < matchedKeywords.length; i++) {
        let node = document.createElement("button");
        node.addEventListener('click', chipsClickListener);
        node.innerText = matchedKeywords[i];
        node.setAttribute("class", "chip");

        chipsPlate.appendChild(node);
    }

    prevSearched = matchedKeywords;
});
