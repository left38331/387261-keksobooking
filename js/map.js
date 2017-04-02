'use strict';

// количество аватаров = картинки в img/avatars/user**.png
var NUMBER_OF_AVATARS = 8;

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

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


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
  return features.slice(0, Math.floor(Math.random() * FEATURES.length));
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

// Наполняем массив объектами предложений
var offersList = [];
for (var i = 0; i < 8; i++) {
 offersList.push(makeNewOffer());
}

var lodgeTemplate = document.querySelector('#lodge-template').content;

var pinListElement = document.querySelector('.tokyo__pin-map');

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

function features2HTML (features) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var featureElement = document.createElement('span');
    featureElement.className = 'feature__image feature__image--' + features[i];
    fragment.appendChild(featureElement);
  }
  return fragment;
}



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

var firstOffer = renderOffer (offersList[0]);
var dialogPanel = document.querySelector('.dialog__panel');

dialogPanel.parentNode.replaceChild(firstOffer,dialogPanel);

var dialogTitle = document.querySelector('.dialog__title');
dialogTitle.querySelector('img').src = offersList[0].author.avatar;


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
  imgElement.className = 'rounded';
  imgElement.width = '40';
  imgElement.height = '40';

  //pinElement.insertAdjacentHTML('beforeend', imgElement); //так почему-то не работает
  pinElement.appendChild(imgElement);
  //debugger;
  return pinElement;
}

/**
 * Функция заполнения блока DOM-элементами используя renderPin(offersList[i])
 * @return {fragment}
 */
function fillFragment () {
  var fragment = document.createDocumentFragment();
  for (i = 0; i < 8; i++) {
    fragment.appendChild(renderPin(offersList[i]));
  }

  return fragment;
}

pinListElement.appendChild(fillFragment());