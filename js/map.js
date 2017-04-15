'use strict';

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param {*} integer n: длина десятичной части
 * @param {*} integer x: длина целой части
 * @param {*} mixed   s: разделитель секций
 * @param {*} mixed   c: десятичный разделитель
 */
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


var pinListElement = document.querySelector('.tokyo__pin-map');



// DOM панель подробного описания предложения по жилью
var dialogPanel = document.querySelector('.dialog__panel');

// div с картиной аватара в описании предложения
var dialogTitle = document.querySelector('.dialog__title');



// Объявляем Массив предложений по проживанию
var offersList = [];

// Наполняем наш массив предложениями
// наполненеие данных описано в data.js
fillOfferList(offersList);

// DOM элемент первого предложения по жилью
var firstOffer = renderOffer (offersList[0]);

dialogTitle.querySelector('img').src = offersList[0].author.avatar;


// Заменяем стандарную панель предложения на первое автомитчески сгенерированное
dialogPanel.parentNode.replaceChild(firstOffer, dialogPanel);

/**
 * Функция генерирует пин на карте (div элемент с вложенным img)
 * @param {*} offer Объект JS, описывающий предложение по аренде 
 */
function renderPin (offer) {
  var pinElement = document.createElement('div');
  pinElement.className = 'pin';
  pinElement.style.left = (offer.location.x - 56/2) + 'px';
  pinElement.style.top = (offer.location.y - 75) + 'px';

  var imgElement = document.createElement('img');
  imgElement.src = offer.author.avatar;
  imgElement.tabIndex = 0; // для возможности выделять по tab
  imgElement.className = 'rounded';
  imgElement.width = '40';
  imgElement.height = '40';

  pinElement.insertAdjacentHTML('beforeend', imgElement.outerHTML);
  //pinElement.appendChild(imgElement);
  //debugger;
  return pinElement;
}

/**
 * Функция заполнения блока DOM-элементами используя renderPin(offersList[i])
 * @return {fragment}
 */
function fillFragment () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 8; i++) {
    fragment.appendChild(renderPin(offersList[i]));
  }

  return fragment;
}

// Отрисовываем пины случайных предложений на карте (класс '.tokyo__pin-map')
pinListElement.appendChild(fillFragment());

// --------------------------------------------------------------
// Делаем обработчики событий
// --------------------------------------------------------------
var dialogClose = dialogTitle.querySelector('.dialog__close');
var dialogForm = document.querySelector('.dialog');
var pinElements = document.getElementsByClassName('pin');
var clickedElement = null; // объявляем выбранный элемент на странице (пин)
var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;


// Добавляем класс 'pin--active' первому пину, потому что он отображается в начале
pinElements[1].classList.add('pin--active');
//debugger;
clickedElement = pinElements[1]; // текущий выбранный элемент - первый

//console.log('Количество пинов: ' + pinElements.length);

document.addEventListener('keydown', onEscPress); // добавляет EventListener на ESC
 
function pinClickHandler (evt) {
  //console.log(evt);
  //debugger;

  // убираем класс 'pin--active' с ранее активного пина
  if (clickedElement) {
    clickedElement.classList.remove('pin--active');
  }

  // добавляем класс 'pin--active' выбранному пину
  clickedElement = evt.currentTarget;
  clickedElement.classList.add('pin--active');

  // Отображаем панель с информацией по выбранному пину
  // номер требуемого объекта определяем по пину с классом 'pin--active'
  for (var i = 1; i < pinElements.length; i++) {
    if (pinElements[i].classList.contains('pin--active')) {
      //console.log('Active pin number is ' + (i - 1));
      
      // обновляем панель с информацией по объекту
      // не могу использовать ранее объявленный dialogPanel, видимо после использования appendChild
      dialogForm.replaceChild(renderOffer (offersList[i - 1]), document.querySelector('.dialog__panel'));
      dialogTitle.querySelector('img').src = offersList[i - 1].author.avatar;
    }
  }

  dialogForm.style.display = 'block';
  document.addEventListener('keydown', onEscPress); // добавляет EventListener на ESC
  //console.log('executed!');
}

/**
 * Функция проверки нажатия ESCAPE клавиши
 * @param {*} evt событие
 */
function onEscPress(evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closeDialogPanel();
  }
}

/**
 * Функция закрытия панели с информацией по объекту
 */
function closeDialogPanel() {
  dialogForm.style.display = 'none';
  clickedElement.classList.remove('pin--active');
  document.removeEventListener('keydown', onEscPress); // убираем EventListener на ESC
}

// добавляем EventListener на каждый из пинов (class='pin')
for (var i = 0; i < pinElements.length; i++) {
  if (!pinElements[i].classList.contains('pin__main')){
    pinElements[i].addEventListener('click', pinClickHandler, false);
    pinElements[i].addEventListener('keydown', function (evt) {
      if (isActivationEvent(evt)) {
        console.log('pressed');
        pinClickHandler(evt);
      };
    });
  }
}

 function isActivationEvent(evt) {
   return evt.keyCode === ENTER_KEY_CODE;
 }

// EventListener для закрытия панели описания объекта
dialogClose.addEventListener('click', function() {
  //dialogDialog.classList.add('invisible'); //альтернативный вариант
  dialogForm.style.display = 'none';
  
  // убираем выделение с активного пина, но только если такой существует
  if (clickedElement) {
    clickedElement.classList.remove('pin--active');
  }

});


// -----------------------------------------------------------------
// Проверка правильности введённых данных
// -----------------------------------------------------------------
var checkinSelectElements = document.querySelector('#time');
var checkoutSelectedElements = document.querySelector('#timeout');
var priceElement = document.querySelector('#price');
var typeElement = document.querySelector('#type');
var roomNumOptioins = document.querySelector('#room_number');
var capacityOptions = document.querySelector('#capacity');
var formElement = document.querySelector('.notice__form');

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

// добавлем все EventListener и инициируем начальные значения для формы
init();


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

