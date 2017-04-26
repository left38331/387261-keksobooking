// data.js
// модуль генерации предложений
'use strict'

window.data = (function () {
  // количество предложений
  var NUMBER_OF_OFFERS = 8;

  // количество аватаров = картинки в img/avatars/user**.png
  var NUMBER_OF_AVATARS = 8;

  var HOUSE_TYPES = ['flat', 'house', 'bungalo'];

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
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  /**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param {*} integer n: длина десятичной части
 * @param {*} integer x: длина целой части
 * @param {*} mixed   s: разделитель секций
 * @param {*} mixed   c: десятичный разделитель
 */
  Number.prototype.format = function (n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  };


  /**
   * Возвращает случайный элемент из массива
   * @param {*} array Входной массив строк
   */
  function pickRandomElem(array) {
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
  function makeNewOffer() {
    var randNum = Math.floor(Math.random() * NUMBER_OF_AVATARS) + 1;
    var xLocation = getRandomInt(300, 900);
    var yLocation = getRandomInt(100, 500);
    return {
      author: {
        avatar: './img/avatars/user' + ((randNum < 10) ? '0' + randNum : randNum) + '.png'
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
   * Функция наполнения массива объектами предложений
   * @param {*} offers array[js obj] Массив предложений по проживаню
   */
  function fillOfferList(offers) {
    for (var i = 0; i < NUMBER_OF_OFFERS; i++) {
      offers.push(makeNewOffer());
    }
    return offers;
  }
  return {
    fillOfferList : fillOfferList,
    randomOffer : makeNewOffer,
    getRandomInt: getRandomInt
  }
})();
