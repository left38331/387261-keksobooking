// map.js
// Основной файл - инициализирует отрисовку пинов и привязку событий к устройствам ввода
'use strict';

var dataURL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/keksobooking/data';

var dialogPanel = document.querySelector('.dialog__panel');
window.lodgeTitle = dialogPanel.querySelector('.lodge__title');
window.lodgeAddress = dialogPanel.querySelector('.lodge__address');
window.lodgePrice = dialogPanel.querySelector('.lodge__price');
window.lodgeType = dialogPanel.querySelector('.lodge__type');
window.lodgeRoomsAndGuests = dialogPanel.querySelector('.lodge__rooms-and-guests');
window.lodgeCheckinTime = dialogPanel.querySelector('.lodge__checkin-time');
window.lodgeFeatures = dialogPanel.querySelector('.lodge__features');
window.lodgeDescription = dialogPanel.querySelector('.lodge__description');
window.lodgePhotos = dialogPanel.querySelector('.lodge__photos');


var pinListElement = document.querySelector('.tokyo__pin-map');

// DOM панель подробного описания предложения по жилью
// var dialogPanel = document.querySelector('.dialog__panel');

// div с картиной аватара в описании предложения
var dialogTitle = document.querySelector('.dialog__title');

// Объявляем Массив предложений по проживанию
var offersList = [];

// массив для вывода трёх случайных объявлений при первичной загрузке
var threeRandomOffers = [];

// --------------------------------------------------------------
// Делаем обработчики событий
// --------------------------------------------------------------
var dialogForm = document.querySelector('.dialog');
var dialogClose = dialogForm.querySelector('.dialog__close');
var pinElements = pinListElement.getElementsByClassName('pin');
var clickedElement = null; // объявляем выбранный элемент на странице (пин)
var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;

/**
 * Наполняем наш массив предложениями, передаваемыми аргументом offersList
 * @param {object} offers масиив предложений
 */
function init(offers) {
  // Отрисовываем пины случайных предложений на карте (класс '.tokyo__pin-map')
  pinListElement.appendChild(fillFragment(offers));

  clickedElement = pinElements[1]; // текущий выбранный элемент - первый

  // добавляем EventListener на каждый из пинов (class='pin')
  Array.prototype.forEach.call(pinElements, function (item) {
    if (!item.classList.contains('pin__main')) {
      item.addEventListener('click', function (evt) {
        pinClickHandler(offers, evt);
      }
        , false);
      item.addEventListener('keydown', function (evt) {
        if (isActivationEvent(evt)) {
          pinClickHandler(offers, evt);
        }
      });
    }
  });
} // end of init ()

/**
 * Функция заполнения блока DOM-элементами используя renderPin(offersList[i]) из pin.js
 * @param {*} offers список предлжоений
 * @return {fragment} блок DOM-элементов
 */
function fillFragment(offers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(window.pins.renderPin(offers[i]));
  }

  return fragment;
}

function pinClickHandler(offers, evt) {
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
      // обновляем панель с информацией по объекту
      window.card.prepareOfferParams(offers[i - 1], window.showCard.showCard);
      dialogTitle.querySelector('img').src = offers[i - 1].author.avatar;
      break;
    }
  }

  window.removeClass(dialogForm, 'invisible');
  document.addEventListener('keydown', onEscPress); // добавляет EventListener на ESC
  // EventListener для закрытия панели описания объекта
  dialogClose.addEventListener('click', onDialogPanelClose);
} // end of pinClickHandler(evt)

/**
 * Функция проверки нажатия ESCAPE клавиши
 * @param {*} evt событие
 */
function onEscPress(evt) {
  // debugger;
  if (evt.keyCode === ESC_KEY_CODE) {
    closeDialogPanel();
    document.removeEventListener('keydown', onEscPress); // убираем EventListener на ESC
  }
}

function onDialogPanelClose() {
  // debugger;
  closeDialogPanel();
  clickedElement.classList.remove('pin--active');
  dialogClose.removeEventListener('click', onDialogPanelClose);
}

/**
 * Функция закрытия панели с информацией по объекту
 */
function closeDialogPanel() {
  window.addClass(dialogForm, 'invisible');
  clickedElement.classList.remove('pin--active');
}


function isActivationEvent(evt) {
  return evt.keyCode === ENTER_KEY_CODE;
}

/**
 * Возвращает случайное целое число между min (включительно) и max (включительно)
 * @param {*} min минимальное число
 * @param {*} max максимальное число
 * @return {integer} случайное число из диапазона
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Функция выборки трёх случайных предложений из исходного списка предложений
 * @param {*} offers исходный массив предложений, считываемый по сети
 */
function getThreeRandomOffers(offers) {
  var slicedOffers = offers.slice(); // копия исходного массива
  for (var i = 0; i <= 2; i++) {
    var randNum = getRandomInt(0, slicedOffers.length - 1); // генерируем случайно число
    threeRandomOffers.push(slicedOffers[randNum]); // вставляем случайный элемент в новый массив из трёх предложений
    slicedOffers.splice(randNum, 1); // удалём выбранный элемент из копии предложений
  }
}

// инициализация для map.js
window.load.load(dataURL, function (data) {
  offersList = JSON.parse(data);
  // при первой загрузке нужно отобразить только первые 3 произвольных варианта
  getThreeRandomOffers(offersList);
  init(threeRandomOffers); // отрисовываем три случайных предложения на карте, фильтр игнорируем по тех заданию
  window.filter.addEventListenerOnFilterChange(); // активируем addEventListener
});
