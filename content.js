const downloadBtnClassName = 'icon-font-chess download daily-game-footer-button';
const pgnDivClassName = 'share-menu-tab-image-component share-menu-tab';
const pgnAttrName = 'pgn';
const closeBtnClassName = 'icon-font-chess x ui_outside-close-icon';
const btnsContainerClassName = 'daily-game-footer-button-group';
const btnGenericClassName = 'icon-font-chess';
const iconFileName = 'lichess_icon.png';
const liveBtnsContainerClassName = 'live-game-buttons-button-group';
const liveDownloadBtnClassName = 'icon-font-chess download live-game-buttons-button';


function openAnalysis(pgn) {
    chrome.runtime.sendMessage({action: 'openAnalysis', pgn: pgn});
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function getPGN(live) {
    const downloadCname = (live) ? liveDownloadBtnClassName : downloadBtnClassName;

    // open the Download Game popup
    var btn = document.getElementsByClassName(downloadCname);

    while (btn.length === 0) {
        btn = document.getElementsByClassName(downloadCname);
        await delay(1000);
    }

    btn[0].click();

    // find the div containing the PGN (the PGN div is the same for both live and archived games)
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

function getExtensionBtn(live) {
    const btn = document.createElement('button');

    btn.className = btnGenericClassName;
    btn.title = 'Import game to LiChess.org';
    btn.style.backgroundColor = 'transparent';
    btn.style.padding = '0';
    btn.style.border = 'none';
    btn.style.margin = '10px';

    btn.onclick = () => {getPGN(live)};

    const icon = getIcon();
    btn.appendChild(icon);

    return btn;
}

async function getBtnContainer() {
    var btnContainer = document.getElementsByClassName(btnsContainerClassName);
    var live = false;

    while (btnContainer.length === 0) {
        await delay(1000);
        btnContainer = document.getElementsByClassName(btnsContainerClassName);
        if (btnContainer.length > 0) {
            break;
        }

        // check if there is a live game in the DOM
        btnContainer = document.getElementsByClassName(liveBtnsContainerClassName);
        if (btnContainer.length > 0) {
            live = true;
        }
    }

    return btnContainer[0];
}

async function insertExtensionBtn() {
    var btnContainer = await getBtnContainer();

    var live = false;

    while (btnContainer.childElementCount !== 4) {
        console.log('waiting', btnContainer.childElementCount, btnContainer);
        live = true;
        await delay(1000);
        btnContainer = await getBtnContainer();
    }

    const btn = getExtensionBtn(live);
    btnContainer.appendChild(btn);
}

document.onreadystatechange = async function() {
    if (document.readyState === 'complete') {
        await insertExtensionBtn();
    }
};
