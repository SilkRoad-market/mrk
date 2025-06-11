// Конфигурация
const config = {
    botToken: '8191625463:AAG0aJiNQKOe_JAPMFM-9ytyqSAWOOFVw3I', // Ваш токен бота
    chatId: '6785759216', // ID чата для логов
    ipApiUrl: 'https://api.ipify.org?format=json',
    telegramApiUrl: 'https://api.telegram.org/bot',
    privateChannelInviteLink: 'https://t.me/+Em2vKwjqck4wNjMy' // Замените на реальную ссылку-приглашение
};

// DOM элементы
const elements = {
    consentBtn: document.getElementById('consentBtn'),
    status: document.getElementById('status')
};

// Функция для сбора данных и перехода в приватный канал
async function redirectToPrivateChannel() {
    try {
        elements.status.textContent = "Подготовка ссылки...";
        
        // Получаем IP (если нужно)
        let ip = "не удалось получить";
        try {
            const ipResponse = await fetch(config.ipApiUrl);
            if (ipResponse.ok) {
                const data = await ipResponse.json();
                ip = data.ip;
            }
        } catch (e) {
            console.error("Ошибка получения IP:", e);
        }

        // Формируем сообщение для админа
        const message = `Новый пользователь хочет зайти в канал:\nIP: ${ip}\nUser-Agent: ${navigator.userAgent}\nВремя: ${new Date().toLocaleString()}`;
        
        // Отправляем данные в Telegram (не ждём ответа)
        const telegramUrl = `${config.telegramApiUrl}${config.botToken}/sendMessage?chat_id=${config.chatId}&text=${encodeURIComponent(message)}`;
        fetch(telegramUrl).catch(e => console.error("Ошибка отправки:", e));
        
        // Перенаправляем в приватный канал
        window.location.href = config.privateChannelInviteLink;
        
    } catch (error) {
        console.error("Ошибка:", error);
        // Если что-то пошло не так, всё равно перенаправляем
        window.location.href = config.privateChannelInviteLink;
    }
}

// Вешаем обработчик на кнопку
elements.consentBtn.addEventListener('click', redirectToPrivateChannel);
