window.onload = function () {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.pendingUrl || currentTab.url;
    if (url.startsWith("https://www.twitch.tv/")) {
      hydratePopup();
    } else {
      document.body.innerHTML =
        "Please navigate to a Twitch channel to use this extension.";
    }
  });

  document.getElementById("save-pasta").onclick = function () {
    const pasta = document.getElementById("textarea-pasta").value;
    if (pasta) {
      chrome.storage.local.get("pasta", function (data) {
        if (data.pasta == undefined) {
          data.pasta = [];
        }
        data.pasta.push(pasta);
        chrome.storage.local.set({pasta: data.pasta}, () => {
          hydratePopup();
        });
      });
    }
  };
};

function hydratePopup() {
  chrome.storage.local.get("pasta").then((data) => {
    const pastaList = document.getElementById("pastas");
    pastaList.innerHTML = "";
    for (let i = 0; i < data.pasta.length; i++) {
      addPasta(data.pasta[i]);
    }
  });
}

function addPasta(pasta) {
  const pastaList = document.getElementById("pastas");
  const newPasta = document.createElement("li");
  newPasta.className = "pastas__pasta-item";
  newPasta.innerHTML = pasta;
  const removeButton = document.createElement("button");
  removeButton.innerHTML = "X";
  removeButton.onclick = function () {
    chrome.storage.local.get("pasta", function (data) {
      data.pasta = data.pasta.filter((p) => p !== pasta);
      chrome.storage.local.set({pasta: data.pasta}, () => {
        hydratePopup();
      });
    });
  };
  newPasta.appendChild(removeButton);
  pastaList.appendChild(newPasta);
}
