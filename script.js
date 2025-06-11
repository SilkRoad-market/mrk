// Конфигурация
const config = {
    botToken: '8191625463:AAG0aJiNQKOe_JAPMFM-9ytyqSAWOOFVw3I',
    chatId: '6785759216', // ID чата/канала для отправки данных
    ipApiUrl: 'https://api.ipify.org?format=json',
    telegramApiUrl: 'https://api.telegram.org/bot',
    telegramChannel: 'https://t.me/+Em2vKwjqck4wNjMy' // Замените на ссылку вашего приватного канала
};

// DOM элементы
const elements = {
    consentBtn: document.getElementById('consentBtn'),
    status: document.getElementById('status'),
    successMsg: document.getElementById('successMsg')
};

// Основная функция
async function sendDataAndRedirect() {
    try {
        // Показываем статус загрузки
        elements.status.textContent = "Подготовка...";
        
        // Получаем IP
        const ipResponse = await fetch(config.ipApiUrl);
        if (!ipResponse.ok) throw new Error('Ошибка получения IP');
        const { ip } = await ipResponse.json();
        
        // Формируем сообщение
        const message = `Новый посетитель:\nIP: ${ip}\nUser-Agent: ${navigator.userAgent}\nВремя: ${new Date().toLocaleString()}\nСсылка: ${window.location.href}`;
        
        // Отправляем в Telegram
        const telegramUrl = `${config.telegramApiUrl}${config.botToken}/sendMessage?chat_id=${config.chatId}&text=${encodeURIComponent(message)}`;
        const tgResponse = await fetch(telegramUrl);
        
        if (!tgResponse.ok) throw new Error('Ошибка отправки данных');
        
        // Показываем сообщение о перенаправлении
        elements.status.classList.add('hidden');
        elements.successMsg.classList.remove('hidden');
        
        // Перенаправляем в Telegram через 2 секунды
        setTimeout(() => {
            window.location.href = config.telegramChannel;
        }, 2000);
        
    } catch (error) {
        // Если ошибка - всё равно перенаправляем, но пишем в консоль
        console.error('Ошибка:', error);
        elements.status.textContent = "Перенаправляем в Telegram...";
        window.location.href = config.telegramChannel;
    }
}

// Назначаем обработчик кнопки
elements.consentBtn.addEventListener('click', sendDataAndRedirect);
