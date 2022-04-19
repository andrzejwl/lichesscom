const pgnTextAreaClassName = 'copyable autoselect';
const pairDivClassName = 'pair';
const importBtnClassName = 'button button-thin action text';

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function loadPGN(pgn) {
    var div = document.getElementsByClassName(pairDivClassName);

    var textarea;

    for (let inputDiv of div) {
        if (inputDiv.querySelectorAll(".name")[0].innerHTML === 'PGN') {
            textarea = inputDiv.getElementsByTagName('textarea')[0];
            break;
        }
    }
    if (!textarea) {
        return;
    }

    textarea.value = pgn;
    textarea.focus();

    var importBtn = document.getElementsByClassName(importBtnClassName);
    importBtn[0].click();
};

function loadOnPageReadyListener() {
    if (document.readyState === 'complete') {
        loadPGN();
    }
}


chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === 'openAnalysis') {
        loadPGN(req.pgn);
    }
});
