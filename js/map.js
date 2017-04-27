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
var dialogClose = document.querySelector('.dialog__close');
var dialogForm = document.querySelector('.dialog');
var pinElements = document.getElementsByClassName('pin');
var clickedElement = null; // объявляем выбранный элемент на странице (пин)
var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;

/**
 * Наполняем наш массив предложениями, передаваемыми аргументом offersList
 * @param {object} offersList масиив предложений
 */
function init(offers) {

  window.card.prepareOfferParams(offers[0], window.showCard.showCard);

  dialogTitle.querySelector('img').src = offers[0].author.avatar;

  // Отрисовываем пины случайных предложений на карте (класс '.tokyo__pin-map')
  pinListElement.appendChild(fillFragment(offers));

  // Добавляем класс 'pin--active' первому пину, потому что он отображается в начале
  pinElements[1].classList.add('pin--active');

  clickedElement = pinElements[1]; // текущий выбранный элемент - первый

  document.addEventListener('keydown', onEscPress); // добавляет EventListener на ESC

  // добавляем EventListener на каждый из пинов (class='pin')
  for (var i = 0; i < pinElements.length; i++) {
    if (!pinElements[i].classList.contains('pin__main')) {
      pinElements[i].addEventListener('click', function (evt) {
        pinClickHandler(offers, evt);
      }
        , false);
      pinElements[i].addEventListener('keydown', function (evt) {
        if (isActivationEvent(evt)) {
          pinClickHandler(offers, evt);
        }
      });
    }
  }

  // EventListener для закрытия панели описания объекта
  dialogClose.addEventListener('click', function () {
    dialogForm.style.display = 'none';

    // убираем выделение с активного пина, но только если такой существует
    if (clickedElement) {
      clickedElement.classList.remove('pin--active');
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
    }
  }

  window.removeClass(dialogForm, 'invisible');
  document.addEventListener('keydown', onEscPress); // добавляет EventListener на ESC
} // end of pinClickHandler(evt)

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
  window.addClass(dialogForm, 'invisible');
  clickedElement.classList.remove('pin--active');
  document.removeEventListener('keydown', onEscPress); // убираем EventListener на ESC
}


function isActivationEvent(evt) {
  return evt.keyCode === ENTER_KEY_CODE;
}

/**
 * Функция выборки трёх случайных предложений из исходного списка предложений
 * @param {*} offers исходный массив предложений, считываемый по сети
 */
function getThreeRandomOffers(offers) {
  var slicedOffers = offers.slice(); // копия исходного массива
  for (var i = 0; i <= 2; i++) {
    var randNum = window.data.getRandomInt(0, slicedOffers.length - 1); // генерируем случайно число
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
