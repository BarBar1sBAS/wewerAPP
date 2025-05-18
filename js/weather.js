document.addEventListener('DOMContentLoaded', function() {
    // Выводим в консоль для подтверждения, что скрипт загружен
    console.log('Скрипт погоды загружен успешно');

    // Проверяем авторизацию
    const authToken = localStorage.getItem('authToken');
    console.log('Состояние токена:', authToken ? 'Токен найден' : 'Токен отсутствует');

    if (!authToken) {
        console.log('Перенаправление на страницу входа (токен не найден)');
        window.location.href = 'index.html';
        return;
    }

    const weatherInfo = document.getElementById('weatherInfo');
    const loader = document.getElementById('loader');
    const logoutBtn = document.getElementById('logoutBtn');

    // Обработчик выхода
    logoutBtn.addEventListener('click', function() {
        console.log('Выход из системы...');
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });

    // API ключ для OpenWeatherMap (бесплатный)
    const apiKey = '5d066958a60d315387d9492393935c19'; // Новый рабочий ключ для OpenWeatherMap

    // Получаем данные о погоде
    fetchWeatherData();

    function fetchWeatherData() {
        console.log('Запрос данных о погоде...');

        const url = `https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&lang=ru&appid=${apiKey}`;
        console.log('URL запроса:', url);

        fetch(url)
            .then(response => {
                console.log('Статус ответа:', response.status);
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Недействительный ключ API OpenWeatherMap');
                    } else {
                        throw new Error(`Ошибка сервера погоды: ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('Получены данные о погоде:', data);
                
                // Скрываем индикатор загрузки
                loader.style.display = 'none';
                
                // Отображаем информацию о погоде
                displayWeatherData(data);
            })
            .catch(error => {
                console.error('Ошибка при получении данных о погоде:', error);
                
                loader.style.display = 'none';
                weatherInfo.innerHTML = `
                    <div class="error-message">
                        Произошла ошибка при получении данных о погоде: ${error.message}
                        <br><br>
                        <small>Для решения проблемы необходимо заменить API ключ OpenWeatherMap в файле js/weather.js.</small>
                    </div>
                `;
            });
    }

    function displayWeatherData(data) {
        // Извлекаем необходимые данные
        const city = data.name;
        const temperature = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const pressure = Math.round(data.main.pressure * 0.750062); // Переводим гПа в мм рт.ст.
        
        // Получаем текущую дату
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('ru-RU', options);
        
        console.log('Отображение данных погоды для:', city);
        
        // Создаем HTML для отображения данных
        weatherInfo.innerHTML = `
            <div class="weather-date">${formattedDate}</div>
            <div class="weather-details">
                <div class="weather-main">
                    <div class="weather-temp">${temperature}°C</div>
                    <div class="weather-description">${description}</div>
                    <div class="weather-feels-like">Ощущается как: ${feelsLike}°C</div>
                </div>
                <div class="weather-icon-container">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
                </div>
            </div>
            <div class="weather-extra">
                <div class="weather-extra-item">
                    <span>Скорость ветра:</span>
                    <span>${windSpeed} м/с</span>
                </div>
                <div class="weather-extra-item">
                    <span>Влажность:</span>
                    <span>${humidity}%</span>
                </div>
                <div class="weather-extra-item">
                    <span>Давление:</span>
                    <span>${pressure} мм рт.ст.</span>
                </div>
            </div>
        `;
    }
}); 