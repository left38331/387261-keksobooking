// pin.js
// модуль для отрисовки пина и взаимодействия с ним
'use strict'

window.pins = (function (window, document) {
  /**
   * Функция генерирует пин на карте (div элемент с вложенным img)
   * @param {*} offer Объект JS, описывающий предложение по аренде 
   */
  function renderPin(offer) {
    var pinElement = document.createElement('div');
    pinElement.className = 'pin';
    pinElement.style.left = (offer.location.x - 56 / 2) + 'px';
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
  return {
    renderPin : renderPin
  }
})(window, document);