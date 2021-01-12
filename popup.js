var keywordList;
var userList;
var chipsPlate;
var mode = 0;
// Popup load
document.addEventListener('DOMContentLoaded', function(e) {
    // get onoff status
    chrome.storage.sync.get(['onoff'], function(d) {
        let onoffBtn = document.querySelector("#onoff-btn");
        onoffBtn.checked = d.onoff;
        toggleBtn(onoffBtn);

        onoffBtn.addEventListener('change', function(e) {
            document.querySelector('.onoff-box label').classList.add('active');
            toggleBtn(this);
        });
    });

    // get keyword list
    chrome.storage.sync.get(['keywordList'], function(d) {
        keywordList = new Set(d.keywordList);
        setInitialChips(keywordList);
    })

    // get user Blacklist
    chrome.storage.sync.get(['userList'], function(d) {
        userList = new Set(d.userList);
    })
});

function sendMsgToContent(op) {
    chrome.storage.sync.get(null, function(d) {
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
    if (mode == 0) {
        keywordList.delete($(this).text());
    } else {
        userList.delete($(this).text());
    }
    chipsPlate.removeChild(this);
    saveChangesAtStorage();

    if (mode == 0) {
        sendMsgToContent('keyword-delete');
    } else {
        sendMsgToContent('user-delete');
    }
}

// add chips btn click event
$(".add_form_field").on('mousedown', function(e) {
    $(this).addClass('active');
})

$(".add_form_field").on('mouseup', function(e) {
    $(this).children('input').focus()
})

$(".add_form_field input").on('focusout', function(e) {
    document.querySelector(".formHintBubble").remove();
})

$(".add_form_field input").on('blur', function(e) {
    $(this).val('');
    $(this).parent().removeClass('active')
})

$(".add_form_field input").keypress(function(e) {
    if(event.keyCode === 13) {
        e.preventDefault();
        removeBubble();
        let newKeyword = $(this).val();
        let errMsg = addNewKeyword(newKeyword);
        if (errMsg) {
            printErrorMsg(errMsg);
        } else {
            $(this).blur();
        }
    }
})

$(".add_form_field input").on('input', function(e) {
    removeBubble();
    $(this).val(checkTextLength($(this).val()));
})

function removeBubble() {
    let bubble = document.querySelector(".formHintBubble");
    if (bubble) {
        bubble.remove();
    }
}
function checkTextLength(text) {
    var len = 0;
    for (var i = 0; i < text.length; i++){
        if(escape(text.charAt(i)).length == 6) {
            len++;
        }
        len++;
        if(len > 34) {
            printErrorMsg("글자수 초과!")
            return text.substring(0, i);
        }
    }
    return text;
}

function printErrorMsg(msg) {
    let form = $(".add_chips_back");
    let item = form.first();
    let node = item.get(0);
    let pos = item.position();
    let bubble = $('<span/>').html('<span class="formHintBubble" style="left: '
                   + pos.left + 'px; top: ' + pos.top + 'px;">'
                   + '<i class="fas fa-exclamation-triangle"></i> '
                   + msg + '</span>').contents();
    bubble.insertAfter($(".chips-wrapper"));
}

// radio button click event
$("input:radio[name=tabs]").click(function(){
    if($("input:radio[name=tabs]:checked").val() === 'keyword-tab') {
        if(mode == 1){
            mode = 0;
            removeAllChips();
            resetSearchBar();
            document.getElementById("chip-add-btn").style.display = "block";
            setInitialChips(keywordList);
        }
    } else {
        if(mode == 0){
            mode = 1;
            removeAllChips();
            resetSearchBar();
            document.getElementById("chip-add-btn").style.display = "block";
            setInitialChips(userList);
        }
    }
});

$("#clear-btn").click(function(){
    resetSearchBar();
    document.getElementById("chip-add-btn").style.display = "block";
    if(mode == 0) {
        removeAllChips();
        setInitialChips(keywordList);
    } else {
        removeAllChips();
        setInitialChips(userList);
    }
});

function setInitialChips(list) {
    chipsPlate = document.getElementById("keyword-chips");
    for (let word of list) {
        let node = document.createElement("button");
        node.addEventListener('click', chipsClickListener);
        node.innerText = word;
        node.setAttribute("class", "chip");

        chipsPlate.appendChild(node);
    }
}

function addNewKeyword(newKeyword) {
    newKeyword = newKeyword.trim();
    if (newKeyword == '') {
        return "유효하지 않은 문자열입니다."
    }
    if(mode == 0) {
        if (keywordList.has(newKeyword)) {
            return "이미 존재합니다.";
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
    } else {
        if (userList.has(newKeyword)) {
            return "User already added!";
        } else {
            userList.add(newKeyword);
            let node = document.createElement("button");
            node.addEventListener('click', chipsClickListener);
            node.innerText = newKeyword;
            node.setAttribute("class", "chip");
            chipsPlate.appendChild(node);
            saveChangesAtStorage();

            sendMsgToContent('user-add');
        }
    }
    return null;
}

function saveChangesAtStorage() {
    if (mode == 0){
        chrome.storage.sync.set({'keywordList': Array.from(keywordList)}, function() {
            console.log("Changes saved at keywordList");
        });
    } else {
        chrome.storage.sync.set({'userList': Array.from(userList)}, function() {
            console.log("Changes saved at userList");
        });
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

function removeAllChips() {
    let childs = chipsPlate.querySelectorAll(".chip");
    for (let i = 0; i < childs.length; i++) {
        chipsPlate.removeChild(childs[i]);
    }
}

function resetSearchBar() {
    document.getElementById("searchBar").value = null;
    $("#clear-btn").hide();
}

// Search bar keyup event
let prevKeyword = "";
let prevSearched = [];
document.querySelector("input[name=keyword-searcher]").addEventListener('input', function(event) {
    $("#clear-btn").toggle(Boolean($(this).val()));

    let searchString = event.target.value;
    if (prevKeyword === searchString) {
        return;
    }
    prevKeyword = searchString;

    let matchedKeywords = [];

    // find matched keywords
    if (mode == 0) {
        for (let keyword of keywordList) {
            if (keyword.match(searchString)) {
                matchedKeywords.push(keyword);
            }
        }
    } else {
        for (let user of userList) {
            if (user.match(searchString)) {
                matchedKeywords.push(user);
            }
        }
    }

    // if completely equal, skip it
    if (arraysEqual(prevSearched, matchedKeywords)) {
        return;
    }

    // remove chips
    removeAllChips()

    // show or hide add button
    if (mode == 0) {
        if (keywordList.size === matchedKeywords.length) {
            document.getElementById("chip-add-btn").style.display = "block";
        } else {
            document.getElementById("chip-add-btn").style.display = "none";
        }
    } else {
        if (userList.size === matchedKeywords.length) {
            document.getElementById("chip-add-btn").style.display = "block";
        } else {
            document.getElementById("chip-add-btn").style.display = "none";
        }
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
