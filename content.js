const now = new Date().toGMTString();

console.log("chess.com accessed at "+now);

function openNewTab(url) {
    chrome.runtime.sendMessage({action: 'openTab', url: url}, (response) => {
        console.log(`Sending an openNewTab request.`);
        console.log(`Received the following response: ${JSON.stringify(response)}`);
    });
}

// openNewTab("https://lichess.org");