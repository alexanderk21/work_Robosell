let mForm_data = {};
let mForm_display = false;

const fetchDataFromStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["MFORM_MODAL_DATA", "MFORM_MODAL_FLAG"], resolve);
  });
};

const createElementDiv = (leftLabel, mForm_data, rightLabels, buttonClass) => {
  const newMFDiv = document.createElement("div");
  newMFDiv.className = "row-item-div";

  const newMFDivLeft = document.createElement("div");
  newMFDivLeft.className = "row-item-div-left";
  newMFDivLeft.textContent = leftLabel;

  const newMFDivRight = document.createElement("div");
  newMFDivRight.className = "row-item-div-right";

  if (leftLabel === "本文") {
    const contentTextarea = document.createElement("div");
    contentTextarea.className = "content-textarea";
    contentTextarea.textContent = mForm_data["content"] || "";
    contentTextarea.value = mForm_data["content"] || "";

    const mForm_button = document.createElement("input");
    mForm_button.type = "hidden";
    mForm_button.className = "textarea-value";
    mForm_button.value = mForm_data["content"] || "";

    newMFDivRight.append(contentTextarea, mForm_button);
  } else {
    rightLabels.forEach(label => {
      const mForm_button = document.createElement("input");
      mForm_button.type = "button";
      mForm_button.className = buttonClass;
      mForm_button.value = mForm_data[label] || "";
      newMFDivRight.appendChild(mForm_button);
    });
  }

  newMFDiv.append(newMFDivLeft, newMFDivRight);
  return newMFDiv;
};

const createModal = (contentDivs, infoTableHtml, resultOptionsHtml, closeAction) => {
  const mMFModal = $("<div>").addClass("MFModal");
  const mForm_content = $("<div>").addClass("MFModal-content").attr("id", "mformMFDiv");
  const buttonContainer = $("<div>").addClass("button-container");

  const infoMFModal = $("<table>").addClass("MFinfo").attr("id", "mMFinfo").html(infoTableHtml);
  buttonContainer.append(infoMFModal);

  const resultMFModal = $("<select>").addClass("MFresult").attr("id", "mMFresult").html(resultOptionsHtml);
  buttonContainer.append(resultMFModal);

  const closeContainer = $("<div>").addClass("close-container");
  const closeTab = $("<button>").addClass("Tabclose").attr("id", "mTabclose").html("タブを閉じる").click(closeAction);
  const crossMFModal = $("<span>").addClass("MFclose").attr("id", "mMFclose").html("&times;").click(() => mMFModal.hide());

  closeContainer.append(closeTab, crossMFModal);
  buttonContainer.append(closeContainer);
  mForm_content.append(buttonContainer);

  contentDivs.forEach(div => mForm_content.append(div));

  mMFModal.append(mForm_content);
  $("body").append(mMFModal);
  mMFModal.hide().show();
};

const displayModal = async (e) => {
  const data = await fetchDataFromStorage();
  mForm_data = data.MFORM_MODAL_DATA || {};
  mForm_display = data.MFORM_MODAL_FLAG || false;
  if(!mForm_data['custom_no']){
    mForm_data['custom_no'] = '-';
  }
  if(!mForm_data['customer_id']){
    mForm_data['customer_id'] = '-';
  }
  if(!mForm_data['company_name']){
    mForm_data['company_name'] = '-';
  }
  if (!mForm_display) return;

  if (
    (e.target.nodeName === "INPUT" && (e.target.type === "text" || e.target.type === "email")) ||
    e.target.nodeName === "TEXTAREA"
  ) {
    const contentDivs = [
      createElementDiv("名前", mForm_data, ["full_name", "last_name", "first_name", "full_hira", "last_hira", "first_hira"], "mformButton"),
      createElementDiv("会社名", mForm_data, ["company", "company_hira"], "mformButton"),
      createElementDiv("住所", mForm_data, ["post", "post1", "post2", "address", "city", "street", "building"], "mformButton"),
      createElementDiv("メール", mForm_data, ["email"], "mformButton"),
      createElementDiv("電話番号", mForm_data, ["tel", "tel1", "tel2", "tel3"], "mformButton"),
      createElementDiv("業種・業界", mForm_data, ["business"], "mformButton"),
      createElementDiv("部署名・役職名", mForm_data, ["department", "job"], "mformButton"),
      createElementDiv("本文", mForm_data, ["content"], "mformButton")
    ];

    createModal(
      contentDivs,
      `<thead>
        <tr><th>NO</th><th>顧客ID</th><th>企業名</th></tr>
      </thead>
      <tbody>
        <tr><td>${mForm_data["custom_no"]}</td><td>${mForm_data["customer_id"]}</td><td>${mForm_data["company_name"]}</td></tr>
      </tbody>`,
      `<option>送信成功</option><option>営業拒否</option><option>文字数超え</option><option>フォームなし</option>
      <option>送信エラー</option><option>その他NG</option>`,
      () => chrome.runtime.sendMessage({ closeTab: true })
    );
  }

  $(".mformButton").click(function () {
    chrome.runtime.sendMessage({ selection: $(this).val() });
    e.target.value = $(this).val();
    console.log($(this).val());
    $(".MFModal").remove();
  });

  $(".content-textarea").click(function () {
    chrome.runtime.sendMessage({ selection: $(".textarea-value").val() });
    e.target.value = $(".textarea-value").val();
    console.log($(".textarea-value").val());
    $(".MFModal").remove();
  });
};

document.addEventListener("click", displayModal);

chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
  if (message.closeTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id);
    });
  }
  if (message.action === "clipModal") {
    clipModal(message.data);
  }
});

const clipModal = (data) => {
  if(!data['custom_no']){
    data['custom_no'] = '-';
  }
  if(!data['customer_id']){
    data['customer_id'] = '-';
  }
  if(!data['company_name']){
    data['company_name'] = '-';
  }

  const contentDivs = [
    createElementDiv("名前", data, ["full_name", "last_name", "first_name", "full_hira", "last_hira", "first_hira"], "mformClip"),
    createElementDiv("会社名", data, ["company", "company_hira"], "mformClip"),
    createElementDiv("住所", data, ["post", "post1", "post2", "address", "city", "street", "building"], "mformClip"),
    createElementDiv("メール", data, ["email"], "mformClip"),
    createElementDiv("電話番号", data, ["tel", "tel1", "tel2", "tel3"], "mformClip"),
    createElementDiv("業種・業界", data, ["business"], "mformClip"),
    createElementDiv("部署名・役職名", data, ["department", "job"], "mformClip"),
    createElementDiv("本文", data, ["content"], "mformClip")
  ];

  createModal(
    contentDivs,
    `<thead>
      <tr><th>NO</th><th>顧客ID</th><th>企業名</th></tr>
    </thead>
    <tbody>
      <tr><td>${data["custom_no"]}</td><td>${data["customer_id"]}</td><td>${data["company_name"]}</td></tr>
    </tbody>`,
    `<option>送信成功</option><option>営業拒否</option><option>文字数超え</option><option>フォームなし</option>
    <option>送信エラー</option><option>その他NG</option>`,
    () => document.body.removeChild(document.querySelector(".popup"))
  );

  $(".mformClip").click(function () {
    const value = $(this).val();
    navigator.clipboard.writeText(value).then(() => {
      console.log(`Copied: ${value}`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
  
  $(".content-textarea").click(function () {
    const value = $(".textarea-value").val();
    navigator.clipboard.writeText(value).then(() => {
      console.log(`Copied: ${value}`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
};
