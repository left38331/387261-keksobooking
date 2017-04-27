// load.js
// load - отрпавка на сервер запросов с помощью XMLHttpRequest
'use strict';
// url - стока в которую записан адрес, по которому будет происходить запрос
// onLoad - функция обратного вызова, которая срабатывает при успешном выполнении запроса
window.load = (function (window, document) {
  var OPENED = 1; // вызван open
  var DONE = 4; // запрос завершён

  var statusBlock = document.querySelector('.status__block');
  var statusMessage = statusBlock.querySelector('.status__message');

  function load(url, onLoad) {

    // создаём новый объект XMLHttpRequest
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      // Если обмен данными завершен
      if (request.readyState === DONE) {
        if (request.status === 200) {
          statusBlock.style.display = 'none';
          // передаём управление в onLoad
          onLoad(request.responseText);
        } else { // обрабатываем ошибки
          switch (request.status) {
            case 0:
              changeStatusMessage('error', request.status + ': Нет ответа от сервера!'); // no responce
              break;
            case 400:
              changeStatusMessage('error', request.status + ': Плохой запрос!'); // bad request
              break;
            case 403:
              changeStatusMessage('error', request.status + ': Доступ запрещён!'); // forbidden
              break;
            case 404:
              changeStatusMessage('error', request.status + ': Страница не найдена!'); // not found
              break;
            case 500:
              changeStatusMessage('error', request.status + ': Внутрнення ошибка сервера!'); // Internal server error
              break;
            default:
              changeStatusMessage('error', request.status + ': Какая-то ошибка!'); // some error
          }
        }
      } else {
        if (request.readyState === OPENED) {
          statusBlock.style.display = 'block';
          changeStatusMessage('loading', 'Загрузка данных...'); // выводим DIV с сообщением о загрузке данных
        }
      }
    };

    // конфигурируем GET-запрос на url
    request.open('GET', url, true);
    // отсылаем запрос
    request.send();
  }

  function changeStatusMessage(type, message) {
    if (type === 'error') {
      statusMessage.style.color = 'red';
      statusMessage.style.fontWeight = 'bold';
      statusMessage.style.animation = 'none';
      statusMessage.textContent = message;
    } else if (type === 'loading') {
      statusMessage.style.color = 'black';
      statusMessage.style.fontWeight = 'normal';
      statusMessage.style.animation = 'blinker 1s linear infinite';
      statusMessage.textContent = message;
    } else if (type === 'nodata') {
      statusMessage.style.color = 'black';
      statusMessage.style.fontWeight = 'bold';
      statusMessage.style.animation = 'none';
      statusMessage.textContent = message;
    } else {
      statusMessage.style.color = 'red';
      statusMessage.style.fontWeight = 'bold';
      statusMessage.style.animation = 'none';
      statusMessage.textContent = 'Выбран неправильный тип';
    }
  }
  return {
    load: load,
    changeStatusMessage: changeStatusMessage
  };
})(window, document);
