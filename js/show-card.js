// show-card.js
'use strict'

window.showCard = function (offer) {
  var dialogPanel = document.querySelector('.dialog__panel');
  var lodgeTitle = dialogPanel.querySelector('.lodge__title');
  var lodgeAddress = dialogPanel.querySelector('.lodge__address');
  var lodgePrice = dialogPanel.querySelector('.lodge__price');
  var lodgeType = dialogPanel.querySelector('.lodge__type');
  var lodgeRoomsAndGuests = dialogPanel.querySelector('.lodge__rooms-and-guests');
  var lodgeCheckinTime = dialogPanel.querySelector('.lodge__checkin-time');
  var lodgeFeatures = dialogPanel.querySelector('.lodge__features');
  var lodgeDescription = dialogPanel.querySelector('.lodge__description');
  var lodgePhotos = dialogPanel.querySelector('.lodge__photos');

  lodgeTitle.textContent = offer.title;
  lodgeAddress.textContent = offer.address;
  lodgePrice.textContent = offer.price;
  lodgeType.textContent = offer.type;
  lodgeRoomsAndGuests.textContent = offer.guestsRooms;
  lodgeCheckinTime.textContent = offer.checkInTime;
  lodgeFeatures.innerHTML = '';
  lodgeFeatures.appendChild(offer.features);
  lodgeDescription.textContent = offer.description;
  lodgePhotos.textContent = offer.photos;
}