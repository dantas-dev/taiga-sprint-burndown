chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'getData' }, (response) => {
        sendResponse(response);
      });
    });
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
