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
  var roomNumOptioins = document.querySelector('#room_number');
  var capacityOptions = document.querySelector('#capacity');

  // добавлем все EventListener и инициируем начальные значения для формы
  init();

  function init() {
    checkinSelectElements.addEventListener('click', function () {
      checkoutSelectedElements.selectedIndex = checkinSelectElements.selectedIndex;
    });

    checkoutSelectedElements.addEventListener('click', function () {
      checkinSelectElements.selectedIndex = checkoutSelectedElements.selectedIndex;
    });

    // Добавляем событие на изменение количества комнат в зависимости от количества возможных гостей
    capacityOptions.addEventListener('change', guestNumOnChangeHandler);

    // Добавляем событие отслеживания типа жилья - меняем возможную стоимость
    typeElement.addEventListener('change', typeOnChangeHandler);
    // прогоняем один раз Handler, чтобы задать правильный placeholder
    typeOnChangeHandler({ srcElement: { value: 'Квартира' } });
    priceElement.value = '1000';

    // Добавляем событие на изменение количества возможных гостей в зависимости от количества комнатах
    roomNumOptioins.addEventListener('change', roomNumOnChangeHandler);
    roomNumOnChangeHandler(); // и проверяем разок на старте, чтобы сразу правильно отображать

    // Добавляем событие на изменение типа жилья в зависимости от цены за ночь
    priceElement.addEventListener('change', priceOnChangeHandler);
  }

  /**
   * Функция изменения типа жилья в зависимости от цены за ночь
   * @param {*} evt Событие 
   */
  function priceOnChangeHandler(evt) {
    //debugger;
    var price = evt.srcElement.value;
    if (price < 1000) {
      typeElement.selectedIndex = 1;
    } else if (price < 10000) {
      typeElement.selectedIndex = 0;
    } else {
      typeElement.selectedIndex = 2;
    };
  }

  function typeOnChangeHandler(evt) {
    //debugger;
    var accomodationType = evt.srcElement.value;
    if (accomodationType === 'Лачуга') {
      priceElement.placeholder = '1 - 999'
      if (priceElement.value >= 1000) {
        priceElement.value = 999;
      };
    } else if (accomodationType === 'Квартира') {
      priceElement.placeholder = '1000 - 9999'
      if (priceElement.value < 1000 && priceElement.value != '') {
        priceElement.value = 1000;
      } else if (priceElement.value > 10000) {
        priceElement.value = 9999;
      };
    } else { // if accomodationType === 'Дворец'
      priceElement.placeholder = 'от 10000'
      if (priceElement.value < 10000 && priceElement.value != '') {
        priceElement.value = 10000;
      };
    };
  }

  function roomNumOnChangeHandler() {
    var guestsOK = (roomNumOptioins.selectedIndex === 0) ? false : true;
    if (guestsOK) {
      capacityOptions.selectedIndex = 0; // для 3 гостей
    } else {
      capacityOptions.selectedIndex = 1; // не для гостей
    };
  }

  function guestNumOnChangeHandler() {
    var only1room = (capacityOptions.selectedIndex === 1) ? true : false;
    if (only1room) {
      roomNumOptioins.selectedIndex = 0; // не для гостей
    } else {
      roomNumOptioins.selectedIndex = 1; // установить в 2 комнаты
    };
  }  
})(window, document);