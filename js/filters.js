'use strict';
(function () {
  var filtersForm = document.querySelector('.map__filters');
  var userFilter = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'housing-features': []
  };
  var DEBOUNCE_INTERVAL = 300;
  var lastTimeout;
  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };
  var updatePins = function () {
    var filteredArray = window.load.hosts.slice();
    filteredArray.forEach(function (element) {
      if (element.offer.price < 10000) {
        element.priceRange = 'low';
      } else if (element.offer.price > 50000) {
        element.priceRange = 'high';
      } else {
        element.priceRange = 'middle';
      }
    });
    var popup = document.querySelector('article.popup');
    if (popup) {
      window.map.map.removeChild(popup);
    }
    var arrayCompare = function (firstArray, secondArray) {
      var asd = [];
      firstArray.forEach(function (element1) {
        var sameElements = secondArray.filter(function (element2) {
          return element1 === element2;
        });
        if (sameElements.length !== 0) {
          asd.push(sameElements);
        }
      });
      return (asd.length === firstArray.length) ? true : false;
    };
    filteredArray = filteredArray.filter(function (element) {
      return ((element.offer.type === userFilter['housing-type']) || (userFilter['housing-type'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((element.offer.rooms === parseFloat(userFilter['housing-rooms'])) || (userFilter['housing-rooms'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((element.offer.guests === parseFloat(userFilter['housing-guests'])) || (userFilter['housing-guests'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((element.priceRange === userFilter['housing-price']) || (userFilter['housing-price'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((userFilter['housing-features'] === 'any') || (arrayCompare(userFilter['housing-features'], element.offer.features)));
    });
    var filteredPinsQuantity = (filteredArray.length > 5) ? 5 : filteredArray.length;
    window.pinsCards.pinDrawing(filteredArray, filteredPinsQuantity);
    window.pinsCards.popupAppear(filteredArray);
  };

  filtersForm.addEventListener('change', function (evt) {
    if (evt.target.name === 'features') {
      userFilter['housing-features'].push(evt.target.value);
    } else {
      userFilter[evt.target.name] = evt.target.value;
    }
    debounce(updatePins);
  });
})();
