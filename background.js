chrome.runtime.onInstalled.addListener(() => {
    console.log("extension loaded");
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    console.log(`message from ${sender.tab.url}: ${req}`);

    switch(req.action) {
        case 'openTab':
            handleOpenTab(req.url);
            break;
        default:
            console.log('unknown action from ', sender);
    }

    sendResponse({success: true});
})

function handleOpenTab(url) {
    chrome.tabs.create({
        url: url,
        selected: true,
    });
}
