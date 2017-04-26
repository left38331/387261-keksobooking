// form.js
// модуль, который работает с формой объявления
'use strict'

window.form = (function (window, document) {
  // -----------------------------------------------------------------
  // Проверка правильности введённых данных
  // -----------------------------------------------------------------
  var checkinSelectElements = document.querySelector('#time');
  var checkoutSelectedElements = document.querySelector('#timeout');
  var priceElement = document.querySelector('#price');
  var typeElement = document.querySelector('#type');
  var roomNumOptions = document.querySelector('#room_number');
  var capacityOptions = document.querySelector('#capacity');

  function init() {

    window.synchronizeFields(checkinSelectElements, checkoutSelectedElements, syncValues);
    window.synchronizeFields(checkoutSelectedElements, checkinSelectElements, syncValues);
    window.synchronizeFields(priceElement, typeElement, syncPrice2Type);
    window.synchronizeFields(typeElement, priceElement, syncType2Price);
    window.synchronizeFields(capacityOptions, roomNumOptions, syncCapacity2roomNum)
    window.synchronizeFields(roomNumOptions, capacityOptions, syncRoomNum2Capacity)

    // Функция синхронизации времени заезда и выезда
    function syncValues(e1, e2) {
      e2.selectedIndex = e1.selectedIndex;
    };

    // Добавляем событие на изменение типа жилья в зависимости от цены за ночь
    function syncPrice2Type(e1, e2) {
      var price = e1.value;
      if ((price < 10000) && (e2.selectedIndex === 2)) { // если цена < 10000 и дворец
        e2.selectedIndex = 0; // устанавливаем квартиру
      } else if ((price < 1000) && (e2.selectedIndex === 0)) { // если цена < 1000 и квартира
        e2.selectedIndex = 1; // устанавливаем в лачугу
      }
    }

    /**
     * Добавляем событие отслеживания типа жилья - меняем возможную стоимость
     * @param {*} e1 DOM элемент 1
     * @param {*} e2 DOM элемент 2
     */
    function syncType2Price(e1, e2) {
      var accomodationType = e1.value;
      if (accomodationType === 'Лачуга') {
        e2.placeholder = 'от 0 р.'
      } else if (accomodationType === 'Квартира') {
        e2.placeholder = 'от 1000 р.'
        if (e2.value < 1000 && e2.value != '') {
          e2.value = 1000;
        }
      } else { // if accomodationType === 'Дворец'
        e2.placeholder = 'от 10000 р.'
        if (e2.value < 10000 && e2.value != '') {
          e2.value = 10000;
        };
      };
    }

    /**
     * Добавляем событие на изменение количества комнат в зависимости от количества возможных гостей
     * @param {*} e1 DOM элемент 1
     * @param {*} e2 DOM элемент 2
     */
    function syncCapacity2roomNum(e1, e2) {
      var only1room = (e1.selectedIndex === 1) ? true : false;
      if (only1room) {
        e2.selectedIndex = 0; // не для гостей
      } else {
        e2.selectedIndex = 1; // установить в 2 комнаты
      };
    }

    /**
     * Добавляем событие на изменение количества возможных гостей в зависимости от количества комнатах
     * @param {*} e1 DOM элемент 1
     * @param {*} e2 DOM элемент 2
     */
    function syncRoomNum2Capacity(e1, e2) {
      var guestsOK = (e1.selectedIndex === 0) ? false : true;
      if (guestsOK) {
        e2.selectedIndex = 0; // для 3 гостей
      } else {
        e2.selectedIndex = 1; // не для гостей
      };
    }

    // Синхронизируем разок на старте, чтобы сразу правильно отображать
    syncRoomNum2Capacity(roomNumOptions, capacityOptions);

    // прогоняем один раз Handler, чтобы задать правильный placeholder
    syncType2Price(typeElement, priceElement);
    // значение по умолчанию для цены
    priceElement.value = '1000';
  }

  // добавлем все EventListener и инициируем начальные значения для формы
  init();
})(window, document);