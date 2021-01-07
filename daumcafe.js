chrome.runtime.onMessage.addListener(function(msg) {
    switch (msg.op) {
        case 'switch-on':
        case 'page-load':
        case 'keyword-add':
            if (msg.data.onoff) {
                blurContent(msg.data.keywordList);
            }
            break;
        case 'switch-off':
            unblurContent();
            break;

        // (+) TODO: delete?
    }
});

function blurContent(keywordList) {
    const ifDocument = document.querySelector('iframe').contentDocument;

    // set css style
    let hiddenKeywordCss = ifDocument.getElementById('hidden-keyword-css');
    if (!hiddenKeywordCss) {
        hiddenKeywordCss = ifDocument.createElement('style');
        hiddenKeywordCss.id = 'hidden-keyword-css';
    }
    hiddenKeywordCss.innerHTML =
        '.hidden-keyword { color: transparent !important; text-shadow: 0 0 4px rgba(0,0,0,0.5) !important; transition: 0.5s;}\
         .hidden-keyword:hover { color: initial !important; text-shadow: initial !important;}';
    if (!ifDocument.getElementById(hiddenKeywordCss.id)) {
        ifDocument.querySelector('head').appendChild(hiddenKeywordCss);
    }

    // add class to matched content
    const titles = ifDocument.querySelectorAll(".td_title .txt_item");

    for (let item of titles) {
        if (keywordMatch(item.innerText, keywordList)) {
            item.classList.add('hidden-keyword');
        }
    }
}

function keywordMatch(str, keywordList) {
    for (let keyword of keywordList) {
        if (str.match(keyword)) {
            return true;
        }
    }
    return false;
}

function unblurContent() {
    const ifDocument = document.querySelector('iframe').contentDocument;
    
    const hiddenKeywordCss = ifDocument.getElementById('hidden-keyword-css');
    if (hiddenKeywordCss) {
        hiddenKeywordCss.innerHTML = '.hidden-keyword { transition: 0.5s }';
    }
}