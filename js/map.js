'use strict';
(function () {
  var noticeFieldsets = document.querySelectorAll('.ad-form>fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var noticeForm = document.querySelector('.ad-form');
  var MAIN_ICON_INDEX = 0;
  var PIN_QUANTITY = 5;
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var MAIN_PIN_START_COORDS = {
    X: parseFloat(mainPin.style.left),
    Y: parseFloat(mainPin.style.top)
  };
  var activeModeOff = function () {
    noticeFieldsets.forEach(function (element) {
      element.disabled = 'disabled';
    });
    mapFiltersForm.classList.add('map__filters--disabled');
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }
    if (!noticeForm.classList.contains('ad-form--disabled')) {
      noticeForm.classList.add('ad-form--disabled');
    }
    var popup = document.querySelector('article.popup');
    if (popup) {
      map.removeChild(popup);
    }
    var pins = document.querySelectorAll('button.map__pin');
    pins.forEach(function (element, index) {
      if (index !== window.map.MAIN_ICON_INDEX) {
        window.mapPins.removeChild(element);
      }
    });
    window.map.mainPin.style.top = window.map.MAIN_PIN_START_COORDS.Y + 'px';
    window.map.mainPin.style.left = window.map.MAIN_PIN_START_COORDS.X + 'px';
  };

  var activeModeOn = function () {
    map.classList.remove('map--faded');
    mapFiltersForm.classList.remove('map__filters--disabled');
    window.pinsCards.pinDrawing(window.load.hosts, PIN_QUANTITY);
    window.pinsCards.popupAppear(window.load.hosts);
    noticeForm.classList.remove('ad-form--disabled');
    noticeFieldsets.forEach(function (element) {
      element.disabled = '';
    });
  };

  window.map = {
    'map': map,
    'mainPin': mainPin,
    'MAIN_PIN_START_COORDS': MAIN_PIN_START_COORDS,
    'MAIN_ICON_INDEX': MAIN_ICON_INDEX,
    'activeModeOn': activeModeOn,
    'activeModeOff': activeModeOff
  };
  window.map.activeModeOff();
})();
