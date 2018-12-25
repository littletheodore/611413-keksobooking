'use strict';
(function () {
  var MAIN_ICON_SIZE = 65;
  var halfMainIconSize = MAIN_ICON_SIZE / 2;
  var PIN_QUANTITY = 5;
  var MAIN_ICON_INDEX = 0;
  var MAP_FIELD = {
    width: {
      min: 50,
      max: document.body.clientWidth - 100
    },
    height: {
      min: 130,
      max: 630
    },
  };

  var section = document.querySelector('.map');
  var mainPin = section.querySelector('.map__pin--main');
  var filtersForm = section.querySelector('.map__filters');

  var MAIN_PIN_START_COORDS = {
    X: parseFloat(mainPin.style.left),
    Y: parseFloat(mainPin.style.top)
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form>fieldset');

  var activeModeOff = function () {
    adFormFieldsets.forEach(function (element) {
      element.disabled = 'disabled';
    });
    filtersForm.classList.add('map__filters--disabled');
    if (!section.classList.contains('map--faded')) {
      section.classList.add('map--faded');
    }
    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }
    var popup = document.querySelector('article.popup');
    if (popup) {
      section.removeChild(popup);
    }
    var pins = document.querySelectorAll('button.map__pin');
    pins.forEach(function (element, index) {
      if (index !== window.map.MAIN_ICON_INDEX) {
        window.pins.mapPins.removeChild(element);
      }
    });
    mainPin.style.top = MAIN_PIN_START_COORDS.Y + 'px';
    mainPin.style.left = MAIN_PIN_START_COORDS.X + 'px';
    fillAdress(MAIN_PIN_START_COORDS.X, MAIN_PIN_START_COORDS.Y);
  };

  var activeModeOn = function () {
    window.load(function (hosts) {
      window.load.hosts = [];
      hosts.forEach(function (element, index) {
        window.load.hosts[index] = element;
      });
      window.pins.drawing(window.load.hosts, window.map.PIN_QUANTITY);
      window.cards.popupAppear(window.load.hosts);
    });
    section.classList.remove('map--faded');
    filtersForm.classList.remove('map__filters--disabled');
    adFormFieldsets.forEach(function (element) {
      element.disabled = '';
    });
    adForm.classList.remove('ad-form--disabled');

  };

  var fillAdress = function (iconX, iconY) {
    var adressInput = document.querySelector('#address');
    adressInput.value = Math.round(iconX + halfMainIconSize) + ',' + Math.round(iconY + halfMainIconSize);
    adressInput.readonly = 'readonly';
  };

  var onMouseDown = function (evt) {
    evt.preventDefault();
    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };
      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var newCoords = {
        X: mainPin.offsetLeft - shift.x,
        Y: mainPin.offsetTop - shift.y
      };
      ifIncorrectCoords(newCoords);
      mainPin.style.top = newCoords.Y + 'px';
      mainPin.style.left = newCoords.X + 'px';
      fillAdress(startCoordinates.x + (window.pins.Icon.width / 2), startCoordinates.y + window.pins.Icon.height);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      var shift = {
        x: startCoordinates.x - upEvt.clientX,
        y: startCoordinates.y - upEvt.clientY
      };

      startCoordinates = {
        x: upEvt.clientX,
        y: upEvt.clientY
      };
      var newCoords = {
        X: mainPin.offsetLeft - shift.x,
        Y: mainPin.offsetTop - shift.y
      };
      ifIncorrectCoords(newCoords);
      mainPin.style.top = newCoords.Y + 'px';
      mainPin.style.left = newCoords.X + 'px';
      fillAdress(startCoordinates.x + (window.pins.Icon.width / 2), startCoordinates.y + window.pins.Icon.height);
      activeModeOn();
      mainPin.removeEventListener('mousemove', onMouseMove);
      mainPin.removeEventListener('mouseup', onMouseUp);
    };
    var ifIncorrectCoords = function (newCoords) {
      if ((newCoords.X > MAP_FIELD.width.max) || (newCoords.X < MAP_FIELD.width.min)) {
        newCoords.X = (newCoords.X > MAP_FIELD.width.min) ? MAP_FIELD.width.max : MAP_FIELD.width.min;
      }
      if ((newCoords.Y > MAP_FIELD.height.max) || (newCoords.Y < MAP_FIELD.height.min)) {
        newCoords.Y = (newCoords.Y > MAP_FIELD.height.min) ? MAP_FIELD.height.max : MAP_FIELD.height.min;
      }
      return newCoords;
    };
    mainPin.addEventListener('mousemove', onMouseMove);
    mainPin.addEventListener('mouseup', onMouseUp);
  };

  window.map = {
    'section': section,
    'mainPin': mainPin,
    'filtersForm': filtersForm,
    'adForm': adForm,
    'MAIN_PIN_START_COORDS': MAIN_PIN_START_COORDS,
    'MAIN_ICON_INDEX': MAIN_ICON_INDEX,
    'PIN_QUANTITY': PIN_QUANTITY,
    'activeModeOn': activeModeOn,
    'activeModeOff': activeModeOff,
    'fillAdress': fillAdress,
  };

  window.map.activeModeOff();
  window.map.mainPin.addEventListener('mousedown', onMouseDown);

})();
