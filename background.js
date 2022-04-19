const lichessAnalysisUrl = 'https://lichess.org/analysis';

// chrome.runtime.onInstalled.addListener(() => {
//     console.log("extension loaded");
// });

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    switch(req.action) {
        case 'openTab':
            handleOpenTab(req.url);
            break;
        case 'openAnalysis':
            handleOpenAnalysis(req.pgn);
            break;
        default:
            console.log('unknown action from ', sender);
    }

    sendResponse({success: true});
})

function handleOpenTab(url, _callback=function(newT){}) {
    chrome.tabs.create({
        url: url,
        selected: true,
    }, (newTab) => {
        _callback(newTab);
    });

}

function handleOpenAnalysis(pgn) {
    console.log(`received the following PGN: ${pgn}`);

    // chrome.tabs.create({
    //     url: lichessAnalysisUrl,
    //     selected: true,
    // }, (tab) => {
    //     chrome.runtime.sendMessage(tab.id, )
    // })

    var done = false; // flag variable to prevent continuous re-sending (only executed once)

    handleOpenTab(lichessAnalysisUrl, (newTab) => {
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

            // make sure the status is 'complete' and it's the right tab
            if (!done && tab.url.indexOf(lichessAnalysisUrl) != -1 && changeInfo.status == 'complete') {
                done = true;
                chrome.tabs.sendMessage(newTab.id, {action: 'openAnalysis', pgn: pgn}, (response) => {
                    console.log(`Sent an openAnalysis request.\n Received the following response: ${JSON.stringify(response)}`);
                });

            }
        });

    });
}