// Получение текущего URL сайта
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = new URL(tabs[0].url).hostname;

    const toggleSwitch = document.getElementById('toggle-switch');

    // Проверяем, отключено ли расширение для текущего сайта
    chrome.storage.local.get(['disabledSites'], function (result) {
        const disabledSites = result.disabledSites || [];
        if (disabledSites.includes(currentUrl)) {
            toggleSwitch.checked = false; // Расширение отключено
        } else {
            toggleSwitch.checked = true; // Расширение включено
        }
    });

    toggleSwitch.addEventListener('change', function () {
        chrome.storage.local.get(['чdisabledSites'], function (result) {
            let disabledSites = result.disabledSites || [];
            if (!toggleSwitch.checked) {
                // Если переключатель выключен, добавляем сайт в список отключенных
                if (!disabledSites.includes(currentUrl)) {
                    disabledSites.push(currentUrl);
                }
            } else {
                // Если переключатель включен, удаляем сайт из списка отключенных
                disabledSites = disabledSites.filter(site => site !== currentUrl);
            }

            // Сохраняем обновленный список
            chrome.storage.local.set({ disabledSites: disabledSites }, function () {
                // Обновляем страницу после изменения
                chrome.tabs.reload(tabs[0].id);
            });
        });
    });
});
