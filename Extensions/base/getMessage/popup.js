document.addEventListener('DOMContentLoaded', function () {
  const elm = document.getElementById('languageSpan')
  elm.innerText = chrome.i18n.getMessage("click_here")
  document.querySelector('#accept_lang').addEventListener('click', function () {
    chrome.i18n.getAcceptLanguages(function (languageList) {
      elm.innerText = chrome.i18n.getMessage("chrome_accept_languages", JSON.stringify(languageList))
    })
  });
});
