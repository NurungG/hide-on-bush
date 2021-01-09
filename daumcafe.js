chrome.runtime.onMessage.addListener(function(msg) {
    console.log(msg);
    switch (msg.op) {
        case 'page-load':
        case 'switch-on':
        case 'keyword-add':
        case 'keyword-delete':
            if (msg.data.onoff) {
                blurContent(msg.data.keywordList, msg.data.userBlackList);
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

function userMatch(str, userList) {
    for (let user of userList) {
        if (str === user) {
            return true;
        }
    }
    return false;
}

function blurItems(items, authors, keywordList, userList) {
    if (items.length !== authors.length) {
        console.log("error!! array length not same");
        return;
    }
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const author = authors[i];

        item.style.transition = ".5s";
        author.style.transition = ".5s";
        if (keywordMatch(item.innerText, keywordList) ||
            userMatch(author.innerText, userList)) {
            item.classList.add('hidden-keyword');
            author.classList.add('hidden-keyword');
        } else {
            item.classList.remove('hidden-keyword');
            author.classList.remove('hidden-keyword');
        }
    }
}

function blurContent(keywordList, userList) {
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

    // add class to matched content (posts)
    const postTitles = ifDocument.querySelectorAll(".td_title .txt_item");
    const postAuthors = ifDocument.querySelectorAll(".td_writer .txt_writer");
    blurItems(postTitles, postAuthors, keywordList, userList);

    // (comments)
    const comments = ifDocument.querySelectorAll(".comment_post .original_comment");
    const commentAuthors = ifDocument.querySelectorAll(".comment_post .txt_name");
    blurItems(comments, commentAuthors, keywordList, userList);
}

function unblurContent() {
    const ifDocument = document.querySelector('iframe').contentDocument;

    const hiddenKeywordCss = ifDocument.getElementById('hidden-keyword-css');
    if (hiddenKeywordCss) {
        hiddenKeywordCss.remove();
    }
}
