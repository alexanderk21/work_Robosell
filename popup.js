const host_url = "https://autofill.doc1.jp/";
let mForm_CURRENT_DOMAIN = "";
let mForm_API_KEY = "";

document.getElementById('manual_copy').addEventListener('click', function() {
  console.log('Manual copy button clicked');
  
  // Fetch data from local storage
  chrome.storage.local.get(["MFORM_MODAL_DATA"], function(data) {
    let mForm_data = data.MFORM_MODAL_DATA || {};

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log('Sending message to content script');
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "clipModal",
        data: mForm_data
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log("Message sent successfully");
        }
      });
    });
  });
});

// Load API key from storage
chrome.storage.local.get("MFORM_API_KEY", function (data) {
  mForm_API_KEY = data.MFORM_API_KEY || "";
  $("#api_key").val(mForm_API_KEY);
});

// Load modal flag from storage
chrome.storage.local.get("MFORM_MODAL_FLAG", function (data) {
  const mForm_display =
    data.MFORM_MODAL_FLAG !== undefined ? data.MFORM_MODAL_FLAG : false;
  document.getElementById("sub_input").checked = mForm_display;
});

// Get current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentUrl = tabs[0].url;
  mForm_CURRENT_DOMAIN = new URL(currentUrl).hostname;
  console.log(mForm_CURRENT_DOMAIN);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.closeTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.remove(tabs[0].id);
    });
  }
});

// Event listener for API key save button
document.addEventListener("DOMContentLoaded", function () {
  var keySaveButton = document.getElementById("key_save");
  if (keySaveButton) {
    keySaveButton.addEventListener("click", function () {
      var apiKey = document.getElementById("api_key").value;
      if (apiKey.trim() !== "") {
        chrome.storage.local.set({ MFORM_API_KEY: apiKey }, function () {
          alert("APIキーが正常に保存されました。");
        });
      } else {
        alert("APIキーを入力してください。");
      }
    });
  } else {
    console.warn("The key_save element was not found.");
  }
});
