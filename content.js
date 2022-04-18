const downloadBtnClassName = 'icon-font-chess download daily-game-footer-button';
const pgnDivClassName = 'share-menu-tab-image-component share-menu-tab';
const pgnAttrName = 'pgn';
const closeBtnClassName = 'icon-font-chess x ui_outside-close-icon';

function openNewTab(url) {
    chrome.runtime.sendMessage({action: 'openTab', url: url}, (response) => {
        console.log(`Sending an openNewTab request.`);
        console.log(`Received the following response: ${JSON.stringify(response)}`);
    });
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function getPGN() {
    // open the Download Game popup
    var btn = document.getElementsByClassName(downloadBtnClassName);

    while (btn.length === 0) {
        btn = document.getElementsByClassName(downloadBtnClassName);
        await delay(1000);
    }

    btn[0].click();

    // find the div containing the PGN
    var div = document.getElementsByClassName(pgnDivClassName);

    while (div.length === 0) {
        div = document.getElementsByClassName(pgnDivClassName);
        await delay(100);
    }

    var pgnData = div[0].getAttribute(pgnAttrName);

    //close the popup
    var closeBtn = document.getElementsByClassName(closeBtnClassName);
    closeBtn[0].click();

    pgnData = pgnData.split(/\r?\n/);

    let pgnStripped = [];
    pgnData.forEach(line => {
        if (line.length !== 0 && line[0] !== '[')
            pgnStripped.push(line);
    });

    const pgn = pgnStripped.join(' ');
    console.log(pgn);
}

document.onreadystatechange = async function() {
    if (document.readyState === 'complete')
        await getPGN();
};
