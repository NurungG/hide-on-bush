console.log("Hide-on-bush: script is injected");

chrome.runtime.onMessage.addListener(function(msg) {
    console.log(msg);
    switch (msg.op) {
        case 'page-load':
        case 'switch-on':
        case 'item-add':
        case 'item-remove':
            if (msg.data.onoffState) {
                blurContent(msg.data.keywordList, msg.data.userList);
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
    let myDocument;
    if (!document.querySelector('iframe#down')) {
        myDocument = document;
    } else {
        myDocument = document.querySelector('iframe').contentDocument;
    }

    // set css style
    let hiddenKeywordCss = myDocument.getElementById('hidden-keyword-css');
    if (!hiddenKeywordCss) {
        hiddenKeywordCss = myDocument.createElement('style');
        hiddenKeywordCss.id = 'hidden-keyword-css';
    }
    hiddenKeywordCss.innerHTML =
        '.hidden-keyword { color: transparent !important; text-shadow: 0 0 5px rgba(0,0,0,0.5) !important;}\
         .hidden-keyword:hover { color: initial !important; text-shadow: initial !important;}';
    if (!myDocument.getElementById(hiddenKeywordCss.id)) {
        myDocument.querySelector('head').appendChild(hiddenKeywordCss);
    }

    // add class to matched content (posts)
    const postTitles = myDocument.querySelectorAll(".td_title .txt_item");
    const postAuthors = myDocument.querySelectorAll(".td_writer .txt_writer");
    blurItems(postTitles, postAuthors, keywordList, userList);

    // (comments)
    const comments = myDocument.querySelectorAll(".comment_post .original_comment");
    const commentAuthors = myDocument.querySelectorAll(".comment_post .txt_name");
    blurItems(comments, commentAuthors, keywordList, userList);
}

function unblurContent() {
    const myDocument = document.querySelector('iframe').contentDocument;

    const hiddenKeywordCss = myDocument.getElementById('hidden-keyword-css');
    if (hiddenKeywordCss) {
        hiddenKeywordCss.remove();
    }
}
