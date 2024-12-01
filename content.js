chrome.storage.local.get(['disabledSites'], function (result) {
    const disabledSites = result.disabledSites || [];
    const currentUrl = window.location.hostname;

    if (disabledSites.includes(currentUrl)) {
        console.log('NastyaReader отключен на этом сайте:', currentUrl);
        return; // Прерываем выполнение скрипта
    }

    function getTextNodes(element) {
        let textNodes = [];
        function traverse(node) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
                textNodes.push(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.childNodes.forEach(traverse);
            }
        }
        traverse(element);
        return textNodes;
    }

// Получаем текстовые узлы
    let textNodes = getTextNodes(document.body);

// Обрабатываем каждый текстовый узел
    textNodes.forEach(node => {
        let words = node.nodeValue.split(' '); // Разделяем текст на слова
        let updatedWords = words.map(word => {
            if (word.trim().length === 0) return word; // Пропускаем пустые строки
            let boldPart = word.slice(0, Math.min(2, word.length)); // Первые 1-3 буквы
            let restPart = word.slice(Math.min(2, word.length)); // Остальная часть слова
            return `<span style="font-weight: 900;">${boldPart}</span><span style="">${restPart}</span>`; // Собираем слово
        });
        let newHTML = updatedWords.join(' '); // Объединяем слова обратно
        let tempElement = document.createElement('span'); // Создаем временный элемент
        tempElement.innerHTML = newHTML; // Заменяем текст на HTML
        node.parentNode.replaceChild(tempElement, node); // Заменяем узел
    });

});

