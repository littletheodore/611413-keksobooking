//main_pin.js
'use strict';
(function () {
  //Заполнение поля адрес
  var MAIN_ICON_SIZE = 65;
  var halfMainIconSize = MAIN_ICON_SIZE / 2;
  var fillAdress = function (iconX, iconY) {
    var adressInput = document.querySelector('#address');
    adressInput.setAttribute('value', Math.round(iconX + halfMainIconSize) + ',' + Math.round(iconY + halfMainIconSize));
    adressInput.setAttribute('readonly', 'readonly');
  };
  window.fillAdress = fillAdress;

  //Переход в активное состояние по перетаскиванию основной иконки
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

  window.mainPin.addEventListener('mousedown', function (evt) {
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
        X: window.mainPin.offsetLeft - shift.x,
        Y: window.mainPin.offsetTop - shift.y
      }
      ifIncorrectCoords(newCoords);
      window.mainPin.style.top = newCoords.Y + 'px';
      window.mainPin.style.left = newCoords.X + 'px';
      window.fillAdress(startCoordinates.x + (window.PIN.width / 2), startCoordinates.y + window.PIN.height);
    }

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
        X: window.mainPin.offsetLeft - shift.x,
        Y: window.mainPin.offsetTop - shift.y
      }
      ifIncorrectCoords(newCoords);
      window.mainPin.style.top = newCoords.Y + 'px';
      window.mainPin.style.left = newCoords.X + 'px';
      window.fillAdress(startCoordinates.x + (window.PIN.width / 2), startCoordinates.y + window.PIN.height);
      window.mapActiveModeOn();
      window.mainPin.removeEventListener('mousemove', onMouseMove);
      window.mainPin.removeEventListener('mouseup', onMouseUp);

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
    window.mainPin.addEventListener('mousemove', onMouseMove);
    window.mainPin.addEventListener('mouseup', onMouseUp);
  });
})();
