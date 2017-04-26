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
      case 'bungalo': return 'Сарай';
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

  function photos2HTML(photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      var photoElement = document.createElement('img');
      photoElement.setAttribute('src', photos[i]);
      photoElement.setAttribute('alt', 'Lodge photo');
      photoElement.setAttribute('width','52');
      photoElement.setAttribute('height','42');
      fragment.appendChild(photoElement);
    }
    return fragment;
  }
   
  /**
   * Функция создания текстового описания для карточки по жилью на основе js объекта
   * @param {object} deal Объект, описывающий предложение по жилью
   */ 
  function prepareFields(deal) {
    return {
      title: deal.offer.title,
      address: deal.offer.address,
      price: deal.offer.price + ' ₽/ночь',
      type: translateOfferType(deal.offer.type),
      guestsRooms: 'Для ' + deal.offer.guests + ' гостей в ' + deal.offer.rooms + ((deal.offer.rooms === 1) ? ' комнате': ' комнатах'),
      checkInTime: 'Заезд после ' + deal.offer.checkin + ', выезд до ' + deal.offer.checkout,
      features: features2HTML(deal.offer.features),
      description: deal.offer.description,
      photos: photos2HTML(deal.offer.photos)
     }
   }

  /**
   * Генератор HTML из шаблона на основе JS объекта предложения
   * @param {*} deal Объект JS с полным описанием предложения
   */
  function renderOffer(deal) {
    var offerElement = lodgeTemplate.cloneNode(true);
    var dealText = prepareFields(deal);
    offerElement.querySelector('.lodge__title').textContent = dealText.title;
    offerElement.querySelector('.lodge__address').textContent = dealText.address;
    offerElement.querySelector('.lodge__price').textContent = deal.price;
    offerElement.querySelector('.lodge__type').textContent = dealText.type;
    offerElement.querySelector('.lodge__rooms-and-guests').textContent = dealText.guestsRooms;
    offerElement.querySelector('.lodge__checkin-time').textContent = dealText.checkInTime;
    offerElement.querySelector('.lodge__features').appendChild(dealText.features);
    offerElement.querySelector('.lodge__description').textContent = dealText.description;
    offerElement.querySelector('.lodge__photos').appendChild(dealText.photos);

    return offerElement;
  }

  function prepareOfferParams(deal, cb) {

    var dealText = prepareFields(deal);
    
    cb({
      title: dealText.title,
      address: dealText.address,
      price: dealText.price,
      type: dealText.type,
      guestsRooms: dealText.guestsRooms,
      checkInTime: dealText.checkInTime,
      features: dealText.features,
      description: dealText.description,
      photos: dealText.photos
    });
  }

  return {
    renderOffer : renderOffer,
    prepareOfferParams: prepareOfferParams,
    translateOfferType: translateOfferType
  }
})(window, document);