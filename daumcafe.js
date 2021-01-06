document.querySelector("iframe").onload = function () {
    let iframe = document.querySelector("iframe");
    let titles = iframe.contentDocument.querySelectorAll(".td_title .txt_item");

    for (let item of titles) {
        item.style.color = "transparent";
        item.style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
    }

    console.log(titles);
}