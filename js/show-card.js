// show-card.js
'use strict'

window.show_card = (function (window) {

  function showCard(offer) {
    window.lodgeTitle.textContent = offer.title;
    window.lodgeAddress.textContent = offer.address;
    window.lodgePrice.textContent = offer.price;
    window.lodgeType.textContent = offer.type;
    window.lodgeRoomsAndGuests.textContent = offer.guestsRooms;
    window.lodgeCheckinTime.textContent = offer.checkInTime;
    window.lodgeFeatures.innerHTML = '';
    window.lodgeFeatures.appendChild(offer.features);
    window.lodgeDescription.textContent = offer.description;
    window.lodgePhotos.innerHTML = '';
    window.lodgePhotos.appendChild(offer.photos);
  }
  return {
    showCard: showCard
  }
})(window);