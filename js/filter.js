// filter.js
// модуль для фильтрации данных по предложениям
'use strict'

window.filter = function (window, document) {
	var filters = document.querySelector('.tokyo__filters');
	var allfilters = filters.querySelectorAll('.tokyo__filter');
	var housingFeatures = filters.querySelector('.tokyo__filter-set');
	var features = filters.querySelectorAll('.feature');
	// debugger;
	features[0].childNodes[1].defaultValue;

	var filteredList = []; // отфильтрованный массив предложений

	var statusBlock = document.querySelector('.status__block');

	function addEventListenerOnFilterChange() {

		filters.addEventListener('change', onFilterChange);
		// housingFeatures.addEventListener('change', onFilterChange);

	}

	function onFilterChange() {
		window.debounce(showPins);
	}

	function showPins() {
		// debugger;

		filteredList = offersList.slice();

		// фильтруем по типу жилья
		filteredList = filteredList.filter(function (item) {
			var filterText = allfilters[0].options[allfilters[0].selectedIndex].text // текст фильтра типа жилья
			if (filterText === 'Любой тип жилья') {
				return true;
			} else return (window.card.translateOfferType(item.offer.type) === filterText);
		});

		// фильтруем по цене
		filteredList = filteredList.filter(function (item) {
			//debugger;
			var selectedPriceRange = allfilters[1].selectedIndex // индекс выбранной опции по стоимости
			switch (selectedPriceRange) {
				case 0: // если от 10000 до 50000
					if (item.offer.price >= 10000 && item.offer.price < 50000) {
						return true;
					} else return false;
					break;
				case 1: // если до 10000
					return (item.offer.price < 10000)
					break;
				case 2: // если более 50000
					return (item.offer.price >= 50000)
					break;
				default:
					return false;
			}
		});

		// фильтруем по числу комнат
		filteredList = filteredList.filter(function (item) {
			//debugger;
			var selectedRoomsIndex = allfilters[2].selectedIndex // индекс определят количество комнат
			switch (selectedRoomsIndex) {
				case 0: // если любое количество комнат
					return true;
					break;
				case 1: // одна комната
					return (item.offer.rooms === 1)
					break;
				case 2: // две комнаты
					return (item.offer.rooms === 2)
					break;
				case 3: // три комнаты или больше полагаю
					return (item.offer.rooms >= 3)
					break;
				default: // чёрт его знает
					return false;
			}
		});

		// фильтруем по числу гостей
		filteredList = filteredList.filter(function (item) {
			//debugger;
			var selectedGuestsIndex = allfilters[3].selectedIndex // индекс определят количество комнат
			switch (selectedGuestsIndex) {
				case 0: // если любое количество гостей
					return true;
					break;
				case 1: // один гости
					return (item.offer.guests >= 1)
					break;
				case 2: // два гостя
					return (item.offer.guests >= 2)
					break;
				default: // чёрт его знает
					return false;
			}
		});


		// фильтруем по желаемым опциям
		filteredList = filteredList.filter(function (item) {
			//debugger;
			var desiredFeatures = []; // массив желаемых опций по жилью
			for (var i = 0; i < features.length; i++) {
				if (features[i].childNodes[1].checked) {
					desiredFeatures.push(features[i].childNodes[1].defaultValue);
				}
			}
			if (desiredFeatures.length === 0) {

				return true;
			} else if (compareFeatures(item.offer.features, desiredFeatures)) {
				return true;
			} else return false;
		});


		// console.log(desiredFeatures);

		pinListElement.innerHTML = '';
		pinListElement.appendChild(pinMain);

		// если есть что отрисовать, то отрисовываем
		if (filteredList.length > 0) {
			statusBlock.style.display = 'none';
			// активируем отображение карточки для жилья
			removeClass(dialogForm, 'invisible');
			init(filteredList);
		} else {
			// прячем ранее отображенную карточку жилья
			addClass(dialogForm, 'invisible');
			statusBlock.style.display = 'block';
			window.load.changeStatusMessage('nodata', 'Нет данных для отображения');
		}

	}

	/**
	 * Функция проверки вхождения всех элементов из подмассива subArray в mainArray
	 * @param {[string]} mainArray основной массив
	 * @param {[string]} subArray подмассив
	 */
	function compareFeatures(mainArray, subArray) {
		var isOK = true;
		for (var i = 0; i < subArray.length; i++) {
			isOK = isOK && mainArray.includes(subArray[i]);
		}
		return isOK;
	}

	return {
		addEventListenerOnFilterChange: addEventListenerOnFilterChange,
		showPins: showPins
	}
}(window, document);