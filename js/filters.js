'use strict';
(function () {
  //Фильтрация объявлений
  var MAIN_ICON_INDEX = 0;
  var filtersForm = document.querySelector('.map__filters');
  filtersForm.addEventListener('change', function (evt) {
    var userFilter = {
      'housing-type': 'any',
      'housing-price': 'any',
      'housing-rooms': 'any',
      'housing-guests': 'any',
      'housing-features': []
    };
    if (evt.target.name === 'features') {
      userFilter['housing-features'].push(evt.target.value);
    } else {
      userFilter[evt.target.name] = evt.target.value;
    }
    var popup = document.querySelector('article.popup');
    if (popup) {
      map.removeChild(popup);
    }
    var pins = document.querySelectorAll('button.map__pin');
    pins.forEach(function (element, index) {
      if (index !== MAIN_ICON_INDEX) {
        mapPins.removeChild(element);
      }
    });
    console.log(window.load.hosts);
    console.log(userFilter);
    var filteredArray = window.load.hosts.slice();
    filteredArray.forEach(function (element) {
      if (element.offer.price < 10000) {
        element.priceRange = 'low';
      } else if (element.offer.price > 50000) {
        element.priceRange = 'high';
      } else {
        element.priceRange = 'middle';
      }
    })
    var typeFilteredArray = filteredArray.filter(function (element) {
      return ((element.offer.type === userFilter['housing-type']) || (userFilter['housing-type'] === 'any'));
    });
    var roomsFilteredArray = typeFilteredArray.filter(function (element) {
      return ((element.offer.rooms === userFilter['housing-rooms']) || (userFilter['housing-rooms'] === 'any'));
    });
    var guestsFilteredArray = roomsFilteredArray.filter(function (element) {
      return ((element.offer.guests === parseFloat(userFilter['housing-guests'])) || (userFilter['housing-guests'] === 'any'));
    });
    var priceFilteredArray = guestsFilteredArray.filter(function (element) {
      return ((element.priceRange === parseFloat(userFilter['housing-price'])) || (userFilter['housing-price'] === 'any'));
    });
    filteredArray = priceFilteredArray;
    console.log(filteredArray);
    var filteredPinsQuantity = (filteredArray.length > 5) ? 5 : filteredArray.length;
    pinDrawing(filteredArray, filteredPinsQuantity);
    window.popupAppear(filteredArray);

  })

})();
