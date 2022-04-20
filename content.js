const downloadBtnClassName = 'icon-font-chess download daily-game-footer-button';
const pgnDivClassName = 'share-menu-tab-image-component share-menu-tab';
const pgnAttrName = 'pgn';
const closeBtnClassName = 'icon-font-chess x ui_outside-close-icon';
const btnsContainerClassName = 'daily-game-footer-button-group';
const btnGenericClassName = 'icon-font-chess';
const iconFileName = 'icon.png';

function openAnalysis(pgn) {
    chrome.runtime.sendMessage({action: 'openAnalysis', pgn: pgn});
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
    openAnalysis(pgn);
}

function getIcon() {
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL(iconFileName);
    icon.style.height = '24px';
    icon.style.width = '24px';

    return icon;
}

function getExtensionBtn() {
    const btn = document.createElement('button');

    btn.className = btnGenericClassName;
    btn.title = 'Import game to LiChess.org';
    btn.style.backgroundColor = 'transparent';
    btn.style.padding = '0';
    btn.style.border = 'none';
    btn.style.margin = '10px';

    btn.onclick = () => {getPGN()};

    const icon = getIcon();
    btn.appendChild(icon);

    return btn;
}

async function insertExtensionBtn() {
    var btnContainer = document.getElementsByClassName('daily-game-footer-button-group');

    while (btnContainer.length === 0) {
        await delay(1000);
        btnContainer = document.getElementsByClassName('daily-game-footer-button-group');
    }

    const btn = getExtensionBtn();
    btnContainer[0].appendChild(btn);
}

document.onreadystatechange = async function() {
    if (document.readyState === 'complete') {
        await insertExtensionBtn();
    }
};
