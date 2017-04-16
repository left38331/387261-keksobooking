'use strict';


var pinListElement = document.querySelector('.tokyo__pin-map');

// DOM панель подробного описания предложения по жилью
var dialogPanel = document.querySelector('.dialog__panel');

// div с картиной аватара в описании предложения
var dialogTitle = document.querySelector('.dialog__title');

// Объявляем Массив предложений по проживанию
var offersList = [];

// --------------------------------------------------------------
// Делаем обработчики событий
// --------------------------------------------------------------
var dialogClose = document.querySelector('.dialog__close');
var dialogForm = document.querySelector('.dialog');
var pinElements = document.getElementsByClassName('pin');
var clickedElement = null; // объявляем выбранный элемент на странице (пин)
var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;

function init() {
  // Наполняем наш массив предложениями
  // наполненеие данных описано в data.js
  window.data.fillOfferList(offersList);
  // DOM элемент первого предложения по жилью
  //var firstOffer = window.card.renderOffer(offersList[0]);

  window.card.prepareOfferParams(offersList[0], window.showCard);

  dialogTitle.querySelector('img').src = offersList[0].author.avatar;

  // Заменяем стандарную панель предложения на первое автомитчески сгенерированное
  //dialogPanel.parentNode.replaceChild(firstOffer, dialogPanel);



  // Отрисовываем пины случайных предложений на карте (класс '.tokyo__pin-map')
  pinListElement.appendChild(fillFragment());

  // Добавляем класс 'pin--active' первому пину, потому что он отображается в начале
  pinElements[1].classList.add('pin--active');
  //debugger;
  clickedElement = pinElements[1]; // текущий выбранный элемент - первый

  //console.log('Количество пинов: ' + pinElements.length);

  document.addEventListener('keydown', onEscPress); // добавляет EventListener на ESC

  // добавляем EventListener на каждый из пинов (class='pin')
  for (var i = 0; i < pinElements.length; i++) {
    if (!pinElements[i].classList.contains('pin__main')) {
      pinElements[i].addEventListener('click', pinClickHandler, false);
      pinElements[i].addEventListener('keydown', function (evt) {
        if (isActivationEvent(evt)) {
          console.log('pressed');
          pinClickHandler(evt);
        };
      });
    }
  }

  // EventListener для закрытия панели описания объекта
  dialogClose.addEventListener('click', function () {
    //dialogDialog.classList.add('invisible'); //альтернативный вариант
    dialogForm.style.display = 'none';

    // убираем выделение с активного пина, но только если такой существует
    if (clickedElement) {
      clickedElement.classList.remove('pin--active');
    }

  });
} // end of init ()

/**
 * Функция заполнения блока DOM-элементами используя renderPin(offersList[i]) из pin.js
 * @return {fragment}
 */
function fillFragment() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 8; i++) {
    fragment.appendChild(window.pins.renderPin(offersList[i]));
  }

  return fragment;
}

function pinClickHandler(evt) {
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
      window.card.prepareOfferParams(offersList[i - 1], window.showCard);
      //dialogForm.replaceChild(window.card.renderOffer(offersList[i - 1]), document.querySelector('.dialog__panel'));
      dialogTitle.querySelector('img').src = offersList[i - 1].author.avatar;
    }
  }

  dialogForm.style.display = 'block';
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
  dialogForm.style.display = 'none';
  clickedElement.classList.remove('pin--active');
  document.removeEventListener('keydown', onEscPress); // убираем EventListener на ESC
}



function isActivationEvent(evt) {
  return evt.keyCode === ENTER_KEY_CODE;
}

// инициализация для map.js
init();




