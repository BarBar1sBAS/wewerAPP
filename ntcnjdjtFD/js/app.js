document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    if (localStorage.getItem('authToken')) {
        window.location.href = 'weather.html';
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Выводим в консоль для подтверждения, что скрипт загружен
    console.log('Скрипт авторизации загружен успешно');

    // Предустановка тестовых значений для облегчения авторизации
    document.getElementById('email').value = 'eve.holt@reqres.in';
    document.getElementById('password').value = 'cityslicka';

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Проверка на пустые поля
        if (!email || !password) {
            errorMessage.textContent = 'Пожалуйста, заполните все поля';
            return;
        }
        
        console.log('Попытка входа:', email);
        
        // Показываем сообщение о загрузке
        errorMessage.textContent = 'Выполняется вход...';
        
        // Отправляем запрос на авторизацию
        fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'reqres-free-v1'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            console.log('Статус ответа:', response.status);
            
            // Если email не из reqres.in, добавляем специальную обработку 
            if (response.status === 400 && !email.endsWith('@reqres.in')) {
                throw new Error('Для тестовой авторизации используйте email: eve.holt@reqres.in и пароль: cityslicka');
            }
            
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || 'Ошибка авторизации');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Ответ API:', data);
            if (data.token) {
                // Сохраняем токен в localStorage
                localStorage.setItem('authToken', data.token);
                console.log('Токен сохранен, перенаправление...');
                // Перенаправляем на страницу с погодой
                window.location.href = 'weather.html';
            } else {
                errorMessage.textContent = 'Ошибка авторизации: Токен не получен';
            }
        })
        .catch(error => {
            console.error('Ошибка при авторизации:', error);
            errorMessage.textContent = `Ошибка авторизации: ${error.message}`;
            
            // Сбрасываем на тестовые данные при неудачной попытке
            document.getElementById('email').value = 'eve.holt@reqres.in';
            document.getElementById('password').value = 'cityslicka';
        });
    });
    
    // Особая обработка - если ReqRes.in недоступен, добавляем автоматический вход для тестирования
    // Это только для демонстрационных целей!
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('fetch')) {
            console.log('Проблемы с подключением, используем тестовый автовход');
            localStorage.setItem('authToken', 'fake-token-for-testing');
            // Для тестирования, если API недоступно
        }
    }, true);
}); 