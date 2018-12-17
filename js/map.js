'use strict';

//map.js
(function () {
  //Активное-неактивное состояние форм
  var noticeFieldsets = document.querySelectorAll('.ad-form>fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var noticeForm = document.querySelector('.ad-form');
  var mainPin = document.querySelector('.map__pin--main');
  window.mainPin = mainPin;
  var MAIN_ICON_INDEX = 0;
  var map = document.querySelector('.map');
  window.map = map;
  var PIN_QUANTITY = 8;
  var MAIN_PIN_START_COORDS = {
    X: parseFloat(window.mainPin.style.left),
    Y: parseFloat(window.mainPin.style.top)
  };
  window.MAIN_PIN_START_COORDS = MAIN_PIN_START_COORDS;
  //Переход в неактивное состояние форм
  var mapActiveModeOff = function () {
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
      if (index !== MAIN_ICON_INDEX) {
        mapPins.removeChild(element);
      }
    });
    window.mainPin.style.top = window.MAIN_PIN_START_COORDS.Y + 'px';
    window.mainPin.style.left = window.MAIN_PIN_START_COORDS.X + 'px';
  };

  window.mapActiveModeOff = mapActiveModeOff;
  window.mapActiveModeOff();

  var mapActiveModeOn = function () {
    map.classList.remove('map--faded');
    mapFiltersForm.classList.remove('map__filters--disabled');
    window.pinDrawing(PIN_QUANTITY);
    noticeForm.classList.remove('ad-form--disabled');
    noticeFieldsets.forEach(function (element) {
      element.disabled = '';
    });
  };
  window.mapActiveModeOn = mapActiveModeOn;
})();
