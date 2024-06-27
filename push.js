document
  .getElementById("autoInput")
  .addEventListener("click", async function () {
    try {
      const response = await $.ajax({
        type: "GET",
        url: host_url + "api/get_extension_data",
        data: {
          api_key: mForm_API_KEY,
          domain: mForm_CURRENT_DOMAIN,
        },
      });

      if (typeof response !== "object") {
        alert(response);
        return;
      }

      const scriptData = JSON.parse(response.user_data);

      chrome.storage.local.set({ MFORM_MODAL_DATA: scriptData });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: (scriptData) => {
            const inputs = [
              { selector: 'input[name*="last_name"]', key: "last_name" },
              { selector: 'input[name*="lastname"]', key: "last_name" },
              { selector: 'input[name*="surname"]', key: "last_name" },
              { selector: 'input[name*="fullname1"]', key: "last_name" },
              { selector: 'input[name*="first_name"]', key: "first_name" },
              { selector: 'input[name*="firstname"]', key: "first_name" },
              { selector: 'input[name*="forename"]', key: "first_name" },
              { selector: 'input[name="fullname2"]', key: "first_name" },
              { selector: 'input[name*="full_name"]', key: "full_name" },
              { selector: 'input[name*="name"]', key: "full_name" },
              { selector: 'input[name*="ご担当者名"]', key: "full_name" },
              { selector: 'input[name*="last_hira"]', key: "last_hira" },
              { selector: 'input[name*="kana_sei"]', key: "last_hira" },
              { selector: 'input[name*="kana_surname"]', key: "last_hira" },
              { selector: 'input[name*="first_hira"]', key: "first_hira" },
              { selector: 'input[name*="kana_mei"]', key: "first_hira" },
              { selector: 'input[name*="kana_forename"]', key: "first_hira" },
              { selector: 'input[name*="full_hira"]', key: "full_hira" },
              { selector: 'input[name*="name_kana"]', key: "full_hira" },
              { selector: 'input[name="kana"]', key: "full_hira" },
              { selector: 'input[name*="company"]', key: "company" },
              { selector: 'input[name*="kaisya"]', key: "company" },
              { selector: 'input[name*="会社名"]', key: "company" },
              { selector: 'input[name*="company_hira"]', key: "company_hira" },
              { selector: 'input[name*="department"]', key: "department" },
              { selector: 'input[name*="belongs"]', key: "department" },
              { selector: 'input[name*="部署名"]', key: "department" },
              { selector: 'input[name*="business"]', key: "business" },
              { selector: 'input[name*="job"]', key: "job" },
              { selector: 'input[name*="position"]', key: "job" },
              { selector: 'input[name*="service_fee"]', key: "service_fee" },
              { selector: 'input[name="post"]', key: "post" },
              { selector: 'input[name="post_num"]', key: "post" },
              { selector: 'input[name="post1"]', key: "post1" },
              { selector: 'input[name="zip_first"]', key: "post1" },
              { selector: 'input[name="zipcode[data][0]"]', key: "post1" },
              { selector: 'input[name="post2"]', key: "post2" },
              { selector: 'input[name="zip_under"]', key: "post2" },
              { selector: 'input[name="zipcode[data][1]"]', key: "post2" },
              { selector: 'input[name*="address"]', key: "address" },
              { selector: 'input[name*="pref"]', key: "address" },
              { selector: 'select[name*="county"]', key: "address" },
              { selector: 'input[name*="city"]', key: "city" },
              { selector: 'input[name*="street"]', key: "street" },
              { selector: 'input[name*="building"]', key: "building" },
              { selector: 'input[name="tel"]', key: "tel" },
              { selector: 'input[name="your-tel"]', key: "tel" },
              { selector: 'input[name*="電話番号"]', key: "tel" },
              { selector: 'input[name*="tel1"]', key: "tel1" },
              { selector: 'input[name*="tel[data][0]"]', key: "tel1" },
              { selector: 'input[name*="tel_first', key: "tel1" },
              { selector: 'input[name*="tel2"]', key: "tel2" },
              { selector: 'input[name*="tel[data][1]"]', key: "tel2" },
              { selector: 'input[name*="tel_middle', key: "tel2" },
              { selector: 'input[name*="tel3"]', key: "tel3" },
              { selector: 'input[name*="tel[data][2]"]', key: "tel3" },
              { selector: 'input[name*="tel_under', key: "tel3" },
              { selector: 'input[name*="email"]', key: "email" },
              { selector: 'input[name*="mail"]', key: "email" },
              { selector: 'input[name*="メールアドレス"]', key: "email" },
              { selector: 'input[name*="website"]', key: "website" },
              { selector: 'input[name*="employee"]', key: "employee" },
              { selector: 'textarea[name*="content"]', key: "content" },
              { selector: 'textarea[name*="message"]', key: "content" },
              { selector: 'textarea[name*="your-message"]', key: "content" },
            ];

            inputs.forEach(({ selector, key }) => {
              const input = document.querySelector(selector);
              if (input && scriptData[key]) {
                input.value = scriptData[key];
              }
            });
          },
          args: [scriptData],
        });
      });
    } catch (error) {
      alert("Error occurred");
    }
  });

document.getElementById("sub_input").addEventListener("click", function (e) {
  check_input = document.getElementById("sub_input").checked;
  chrome.storage.local.set({ MFORM_MODAL_FLAG: check_input });
});
