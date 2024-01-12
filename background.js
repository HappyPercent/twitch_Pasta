chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.tabs.onUpdated.addListener((i, j, tab) => {
  validateBadge(tab);
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    validateBadge(currentTab);
  });
});

function validateBadge(tab) {
  const url = tab.pendingUrl || tab.url;
  if (url.startsWith("https://www.twitch.tv/")) {
    chrome.action.setBadgeText({
      text: "ON",
    });
  } else {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  }
}
