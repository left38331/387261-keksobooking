// filter.js
// модуль для фильтрации данных по предложениям
'use strict';

window.filter = (function (window, document) {
  var filters = document.querySelector('.tokyo__filters');
  var allfilters = filters.querySelectorAll('.tokyo__filter');
  var features = filters.querySelectorAll('.feature');
  var pinMain = window.pinListElement.querySelector('.pin__main');

  var filteredList = []; // отфильтрованный массив предложений

  var statusBlock = document.querySelector('.status__block');

  function addEventListenerOnFilterChange() {
    filters.addEventListener('change', onFilterChange);
  }

  function onFilterChange() {
    window.addClass(window.dialogForm, 'invisible');
    window.debounce(showPins);
  }

  function showPins() {

    filteredList = window.offersList.slice();

    // фильтруем по типу жилья
    filteredList = filteredList.filter(function (item) {
      var filterText = allfilters[0].options[allfilters[0].selectedIndex].text; // текст фильтра типа жилья
      if (filterText === 'Любой тип жилья') {
        return true;
      }
      return (window.card.translateOfferType(item.offer.type) === filterText);
    });

    // фильтруем по цене
    filteredList = filteredList.filter(function (item) {
      var selectedPriceRange = allfilters[1].selectedIndex; // индекс выбранной опции по стоимости
      switch (selectedPriceRange) {
        case 0: // если от 10000 до 50000
          if (item.offer.price >= 10000 && item.offer.price < 50000) {
            return true;
          }
          return false;
        case 1: // если до 10000
          return (item.offer.price < 10000);
        case 2: // если более 50000
          return (item.offer.price >= 50000);
        default:
          return false;
      }
    });

    // фильтруем по числу комнат
    filteredList = filteredList.filter(function (item) {
      var selectedRoomsIndex = allfilters[2].selectedIndex; // индекс определят количество комнат
      switch (selectedRoomsIndex) {
        case 0: // если любое количество комнат
          return true;
        case 1: // одна комната
          return (item.offer.rooms === 1);
        case 2: // две комнаты
          return (item.offer.rooms === 2);
        case 3: // три комнаты или больше полагаю
          return (item.offer.rooms >= 3);
        default: // чёрт его знает
          return false;
      }
    });

    // фильтруем по числу гостей
    filteredList = filteredList.filter(function (item) {
      var selectedGuestsIndex = allfilters[3].selectedIndex; // индекс определят количество комнат
      switch (selectedGuestsIndex) {
        case 0: // если любое количество гостей
          return true;
        case 1: // один гости
          return (item.offer.guests >= 1);
        case 2: // два гостя
          return (item.offer.guests >= 2);
        default: // чёрт его знает
          return false;
      }
    });


    // фильтруем по желаемым опциям
    filteredList = filteredList.filter(function (item) {
      var desiredFeatures = []; // массив желаемых опций по жилью
      Array.prototype.forEach.call(features, function (element) {
        if (element.childNodes[1].checked) {
          desiredFeatures.push(element.childNodes[1].defaultValue);
        }
      });
      // если опции не важны или совпадают с набором доступных, то предложение устраивает
      if ((desiredFeatures.length === 0) || (compareFeatures(item.offer.features, desiredFeatures))) {
        return true;
      }
      return false;
    });

    window.pinListElement.innerHTML = '';
    window.pinListElement.appendChild(pinMain);

    // если есть что отрисовать, то отрисовываем
    if (filteredList.length > 0) {
      statusBlock.style.display = 'none';
      window.init(filteredList);
    } else {
      statusBlock.style.display = 'block';
      window.load.changeStatusMessage('nodata', 'Нет данных для отображения');
    }

  }

	/**
	 * Функция проверки вхождения всех элементов из подмассива subArray в mainArray
	 * @param {[string]} mainArray основной массив
	 * @param {[string]} subArray подмассив
   * @return {boolean} возвращает true или false
	 */
  function compareFeatures(mainArray, subArray) {
    var isOK = true;
    subArray.forEach(function (item) {
      isOK = isOK && mainArray.includes(item);
    });
    return isOK;
  }

  return {
    addEventListenerOnFilterChange: addEventListenerOnFilterChange,
    showPins: showPins
  };
})(window, document);
