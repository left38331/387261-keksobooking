// card.js
// модуль отрисовки элемента на карточке
'use strict'

window.card = (function (window, document) {
  // Шаблон для панели с информацией по жилью
  var lodgeTemplate = document.querySelector('#lodge-template').content;

  /**
   * Передать русское название типа жилья
   */
  function translateOfferType(offerType) {
    switch (offerType) {
      case 'flat': return 'Квартира';
      case 'bungalo': return 'Бунгало';
      case 'house': return 'Дом';
      default: return 'Unknown type';
    }
  }

  /**
   * Перевод массива опций жилья из [string] в фрагмент из HTML [<span>]
   * @param {*} string features массив опций жилья
   */
  function features2HTML(features) {
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
  function renderOffer(deal) {
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

  return {
    renderOffer : renderOffer
  }
})(window, document);