const keywordList = new Set(['근황', '논란', '코로나', '디시']);

document.querySelector("iframe").onload = function () {
    const ifDocument = document.querySelector('iframe').contentDocument;
    const hiddenKeywordCss = ifDocument.createElement('style');
    hiddenKeywordCss.innerHTML =
        '.hidden-keyword { color: transparent !important; text-shadow: 0 0 4px rgba(0,0,0,0.5) !important; transition: 0.5s;}\
         .hidden-keyword:hover { color: initial !important; text-shadow: initial !important;}';
    ifDocument.querySelector('head').appendChild(hiddenKeywordCss);

    const titles = ifDocument.querySelectorAll(".td_title .txt_item");

    for (let item of titles) {
        if (keywordMatch(item.innerText)) {
            item.classList.add('hidden-keyword');
        }
    }

    console.log(titles);
}

function keywordMatch(str) {
    for (let keyword of keywordList) {
        if (str.match(keyword)) {
            return true;
        }
    }
    return false;
}