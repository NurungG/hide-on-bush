chrome.runtime.onMessage.addListener(function(msg) {
    switch (msg.op) {
        case 'page-load':
        case 'switch-on':
        case 'keyword-add':
        case 'keyword-delete':
            if (msg.data.onoff) {
                blurContent(msg.data.keywordList);
            }
            break;
        case 'switch-off':
            unblurContent();
            break;
    }
});

function keywordMatch(str, keywordList) {
    for (let keyword of keywordList) {
        if (str.match(keyword)) {
            return true;
        }
    }
    return false;
}

function blurContent(keywordList) {
    const ifDocument = document.querySelector('iframe').contentDocument;

    // set css style
    let hiddenKeywordCss = ifDocument.getElementById('hidden-keyword-css');
    if (!hiddenKeywordCss) {
        hiddenKeywordCss = ifDocument.createElement('style');
        hiddenKeywordCss.id = 'hidden-keyword-css';
    }
    hiddenKeywordCss.innerHTML =
        '.hidden-keyword { color: transparent !important; text-shadow: 0 0 5px rgba(0,0,0,0.5) !important;}\
         .hidden-keyword:hover { color: initial !important; text-shadow: initial !important;}';
    if (!ifDocument.getElementById(hiddenKeywordCss.id)) {
        ifDocument.querySelector('head').appendChild(hiddenKeywordCss);
    }

    // add class to matched content (title)
    const titles = ifDocument.querySelectorAll(".td_title .txt_item");

    for (let item of titles) {
        item.style.transition = ".5s";
        if (keywordMatch(item.innerText, keywordList)) {
            item.classList.add('hidden-keyword');
        } else {
            item.classList.remove('hidden-keyword');
        }
    }
}

function unblurContent() {
    const ifDocument = document.querySelector('iframe').contentDocument;
    
    const hiddenKeywordCss = ifDocument.getElementById('hidden-keyword-css');
    if (hiddenKeywordCss) {
        hiddenKeywordCss.remove();
    }
}