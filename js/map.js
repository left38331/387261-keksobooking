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

// количество аватаров = картинки в img/avatars/user**.png
var NUMBER_OF_AVATARS = 8;

// количество предложений
var NUMBER_OF_OFFERS = 8;

// Возможные заголовки предложений
var OFFERS_TITLES = [
  'Большая уютная квартира', 
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец', 
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик', 
  'Уютное бунгало далеко от моря', 
  'Неуютное бунгало по колено в воде'
  ];
var FEATURES = ['wifi','dishwasher','parking', 'washer', 'elevator', 'conditioner'];
var HOUSE_TYPES = ['flat', 'house', 'bungalo'];

// Объявляем Массив предложений по проживанию
var offersList = [];

/**
 * Функция наполнения массива объектами предложений
 * @param {*} offers array[js obj] Массив предложений по проживаню
 */
function fillOfferList (offers) {
  for (var i = 0; i < NUMBER_OF_OFFERS; i++) {
    offers.push(makeNewOffer());
  }
  return offers;
}

// Наполняем наш массив предложениями
fillOfferList(offersList);

// Шаблон для панели с информацией по жилью
var lodgeTemplate = document.querySelector('#lodge-template').content;

var pinListElement = document.querySelector('.tokyo__pin-map');

// DOM элемент первого предложения по жилью
var firstOffer = renderOffer (offersList[0]);

// DOM панель подробного описания предложения по жилью
var dialogPanel = document.querySelector('.dialog__panel');

// div с картиной аватара в описании предложения
var dialogTitle = document.querySelector('.dialog__title');
dialogTitle.querySelector('img').src = offersList[0].author.avatar;

/**
 * Возвращает случайный элемент из массива
 * @param {*} array Входной массив строк
 */
function pickRandomElem (array) {
  return (array[Math.floor(Math.random() * array.length)]);
}

/**
 * Возвращает случайное целое число между min (включительно) и max (включительно)
 * @param {*} min 
 * @param {*} max 
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Возвращает случайную длину для массива FEATURES (опций)
function getFeaturesList(features) {
  return features.slice(0, Math.floor(Math.random() * features.length));
}

// Функция генерации экземпляра предложения в Кексобукинг со всеми параметрами
function makeNewOffer () {
  var randNum = Math.floor(Math.random() * NUMBER_OF_AVATARS) + 1;
  var xLocation = getRandomInt(300, 900);
  var yLocation = getRandomInt(100, 500);
  return {
    author: {
      avatar: './img/avatars/user' + ((randNum < 10) ? '0' + randNum : randNum)  + '.png'
    },
    offer: {
      title: pickRandomElem(OFFERS_TITLES),
      address: '{' + xLocation + '}, {' + yLocation + '}',
      price: getRandomInt(1000, 1000000).format(0, 3, ' ', '.'),
      type: pickRandomElem(HOUSE_TYPES),
      rooms: getRandomInt(1, 5),
      guests: getRandomInt(1, 50),
      checkin: pickRandomElem(['12:00', '13:00', '14:00']),
      checkout: pickRandomElem(['12:00', '13:00', '14:00']),
      features: getFeaturesList(FEATURES),
      description: '',
      photos: []
    },
    location: {
      x: xLocation,
      y: yLocation
    }
  }
}



/**
 * Передать русское название типа жилья
 */
function translateOfferType (offerType) {
    switch (offerType) {
    case HOUSE_TYPES[0]: return 'Квартира';
    case HOUSE_TYPES[1]: return 'Бунгало';
    case HOUSE_TYPES[2]: return 'Дом';
    default: return 'Unknown type';
  }
}

/**
 * Перевод массива опций жилья из [string] в фрагмент из HTML [<span>]
 * @param {*} string features массив опций жилья
 */
function features2HTML (features) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var featureElement = document.createElement('span');
    featureElement.className = 'feature__image feature__image--' + features[i];
    fragment.appendChild(featureElement);
  }
  return fragment;
}


/**
 * Генератор HTML из шаблона на основе JS объекта предложения
 * @param {*} deal Объект JS с полным описанием предложения
 */
function renderOffer (deal) {
  var offerElement = lodgeTemplate.cloneNode(true);

  offerElement.querySelector('.lodge__title').textContent = deal.offer.title;
  offerElement.querySelector('.lodge__address').textContent = deal.offer.address;
  offerElement.querySelector('.lodge__price').textContent = deal.offer.price + ' $/ночь';
  offerElement.querySelector('.lodge__type').textContent = translateOfferType(deal.offer.type);
  offerElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + deal.offer.guests + 'гостей в ' + deal.offer.rooms + ' комнатах';
  offerElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + deal.offer.checkin + ', выезд до ' + deal.offer.checkout;
  offerElement.querySelector('.lodge__features').appendChild(features2HTML(deal.offer.features));
  offerElement.querySelector('.lodge__description').textContent = deal.offer.description;
  offerElement.querySelector('.lodge__photos').textContent = deal.offer.photos;

  return offerElement;
}

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
var titleElement = document.querySelector('#title');
var formElement = document.querySelector('.notice__form');

// Выводим список всех требований для поля Title, если не удовлетворяет условиям
// чтобы предупредить пользователя до отправки формы
titleElement.addEventListener('blur', function () {
  //debugger;
  // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
  if (titleElement.checkValidity() == false) {

    var inputCustomValidation = new window.CustomValidation(); // Создадим объект CustomValidation
    inputCustomValidation.checkValidity(titleElement); // Выявим ошибки
    var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
    titleElement.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

  } // закончился if
});

//console.log(checkinSelectElements.selectedIndex);

checkinSelectElements.addEventListener('click', function() {
  checkoutSelectedElements.selectedIndex = checkinSelectElements.selectedIndex;
});

checkoutSelectedElements.addEventListener('click', function() {
  checkinSelectElements.selectedIndex = checkoutSelectedElements.selectedIndex;
});

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

// Добавляем событие на изменение типа жилья в зависимости от цены за ночь
priceElement.addEventListener('change', priceOnChangeHandler);

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

// Добавляем событие отслеживания типа жилья - меняем возможную стоимость
typeElement.addEventListener('change', typeOnChangeHandler);
// прогоняем один раз Handler, чтобы задать правильный placeholder
typeOnChangeHandler({srcElement : {value : 'Квартира'}});
priceElement.value = '1000';


function roomNumOnChangeHandler() {
  var guestsOK = (roomNumOptioins.selectedIndex === 0) ? false : true;
  if (guestsOK) {
    capacityOptions.selectedIndex = 0; // для 3 гостей
  } else {
    capacityOptions.selectedIndex = 1; // не для гостей
  };
}


// Добавляем событие на изменение количества возможных гостей в зависимости от количества комнатах
roomNumOptioins.addEventListener('change', roomNumOnChangeHandler);
roomNumOnChangeHandler(); // и проверяем разок на старте, чтобы сразу правильно отображать

function guestNumOnChangeHandler() {
  var only1room = (capacityOptions.selectedIndex === 1) ? true : false;
  if (only1room) {
    roomNumOptioins.selectedIndex = 0; // не для гостей
  } else {
    roomNumOptioins.selectedIndex = 1; // установить в 2 комнаты
  };
}


// Добавляем событие на изменение количества комнат в зависимости от количества возможных гостей
capacityOptions.addEventListener('change', guestNumOnChangeHandler);

formElement.addEventListener('submit', function() {
  formElement.reset();
  priceElement.value = '1000';
  roomNumOnChangeHandler();
});

