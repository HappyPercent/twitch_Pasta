let button = document.createElement("button");
button.innerHTML = "Add pasta!";
button.style.position = "absolute";
button.style.visibility = "hidden";
button.style.background = "white";
button.style.color = "black";
button.style.zIndex = 1;
button.style.padding = "4px";
button.style.borderRadius = "4px";
button.id = "chrome-extension-pastaButton";
document.body.appendChild(button);

function copyInner(element) {
  var r = document.createRange();
  r.selectNode(element);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand("copy");
  const text = window.getSelection().toString();
  window.getSelection().removeAllRanges();
  return text;
}

async function handleClick(e) {
  e.preventDefault();
  const path = e.composedPath();
  const chatLineElement = path.find((element) =>
    element.classList?.contains("chat-line__message")
  );
  console.log("chatLineElement: ", chatLineElement);
  const bodyElement = chatLineElement?.querySelector(
    '[data-a-target="chat-line-message-body"]'
  );
  console.log("bodyElement: ", bodyElement);
  const pastaText = bodyElement ? await copyInner(bodyElement) : "";
  console.log("pastaText: ", pastaText);
  const isNameClick = path.some((element) =>
    element.classList?.contains("chat-line__username-container")
  );
  if (!pastaText || isNameClick) {
    return;
  }
  showit(e.pageX, e.pageY, pastaText);
}

document.addEventListener("click", handleClick, false);

document.addEventListener(
  "scroll",
  function (e) {
    if (button.style.visibility == "visible") {
      button.style.visibility = "hidden";
    }
  },
  false
);

//Close the bubble when we click on the screen.
document.addEventListener(
  "mousedown",
  function (e) {
    if (button.id != e.target.id && button.style.visibility == "visible") {
      button.style.visibility = "hidden";
    }
  },
  false
);

function showit(mouseX, mouseY, selection) {
  button.style.top = mouseY + "px";
  button.style.left = mouseX + "px";
  button.style.visibility = "visible";
  button.onclick = function () {
    chrome.storage.local.get("pasta", function (data) {
      data.pasta = data.pasta || [];
      data.pasta.push(selection.toString());
      chrome.storage.local.set({pasta: data.pasta});
      button.style.visibility = "hidden";
    });
  };
}
