'use strict';
(function () {
  var MAIN_ICON_SIZE = 65;
  var halfMainIconSize = MAIN_ICON_SIZE / 2;
  var fillAdress = function (iconX, iconY) {
    var adressInput = document.querySelector('#address');
    adressInput.setAttribute('value', Math.round(iconX + halfMainIconSize) + ',' + Math.round(iconY + halfMainIconSize));
    adressInput.setAttribute('readonly', 'readonly');
  };
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
        X: window.map.mainPin.offsetLeft - shift.x,
        Y: window.map.mainPin.offsetTop - shift.y
      };
      ifIncorrectCoords(newCoords);
      window.map.mainPin.style.top = newCoords.Y + 'px';
      window.map.mainPin.style.left = newCoords.X + 'px';
      window.mainPin.fillAdress(startCoordinates.x + (window.pinsCards.PIN.width / 2), startCoordinates.y + window.pinsCards.PIN.height);
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
        X: window.map.mainPin.offsetLeft - shift.x,
        Y: window.map.mainPin.offsetTop - shift.y
      };
      ifIncorrectCoords(newCoords);
      window.map.mainPin.style.top = newCoords.Y + 'px';
      window.map.mainPin.style.left = newCoords.X + 'px';
      window.mainPin.fillAdress(startCoordinates.x + (window.pinsCards.PIN.width / 2), startCoordinates.y + window.pinsCards.PIN.height);
      window.map.activeModeOn();
      window.map.mainPin.removeEventListener('mousemove', onMouseMove);
      window.map.mainPin.removeEventListener('mouseup', onMouseUp);
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
    window.map.mainPin.addEventListener('mousemove', onMouseMove);
    window.map.mainPin.addEventListener('mouseup', onMouseUp);
  };

  window.map.mainPin.addEventListener('mousedown', onMouseDown);
  window.mainPin = {
    'fillAdress': fillAdress,
  };
})();
