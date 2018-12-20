'use strict';
(function () {
  var adTitle = document.querySelector('#title');
  adTitle.setAttribute('required', 'required');
  adTitle.setAttribute('minlength', '3');
  adTitle.setAttribute('maxlength', '100');
  adTitle.addEventListener('input', function () {
    if ((adTitle.value.length > adTitle.maxLength) || (adTitle.value.length < adTitle.minLength)) {
      adTitle.setAttribute('style', 'outline: 5px solid red');
    } else {
      adTitle.removeAttribute('style', 'outline: 5px solid red');
    }
  });

  var TYPE_MIN_PRICE = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };
  var adForm = document.querySelector('.ad-form');
  var adPrice = document.querySelector('#price');
  var adType = document.querySelector('#type');
  var checkedType = document.querySelector('#type>option:checked');
  adPrice.setAttribute('required', 'required');
  adPrice.setAttribute('type', 'number');
  adPrice.setAttribute('max', '1000000');
  adPrice.setAttribute('min', TYPE_MIN_PRICE[checkedType.value]);
  adPrice.setAttribute('placeholder', TYPE_MIN_PRICE[checkedType.value]);
  adType.addEventListener('change', function (evt) {
    checkedType = evt.target.value;
    adPrice.setAttribute('min', TYPE_MIN_PRICE[checkedType]);
    adPrice.setAttribute('placeholder', TYPE_MIN_PRICE[checkedType]);
  });

  adPrice.addEventListener('input', function () {
    var inputValue = parseFloat(adPrice.value);
    if ((inputValue < adPrice.min) || (inputValue > adPrice.max)) {
      adPrice.setAttribute('style', 'outline: 5px solid red');
    } else {
      adPrice.removeAttribute('style', 'outline: 5px solid red');
    }
  });

  var adCheckIn = document.querySelector('#timein');
  var adCheckOut = document.querySelector('#timeout');
  adCheckIn.addEventListener('change', function (evt) {
    selectReset(adCheckOut);
    var checkedTime = parseFloat(evt.target.value);
    Array.prototype.forEach.call(adCheckOut.children, function (element) {
      if (parseFloat(element.value) === checkedTime) {
        element.setAttribute('selected', 'selected');
      } else {
        element.setAttribute('disabled', 'disabled');
      }
    });
  });

  var adRoomNumber = document.querySelector('#room_number');
  var adCapacity = document.querySelector('#capacity');
  var checkedRoomNumber = document.querySelector('#room_number>option:checked').value;
  var setAvailibleCapacity = function () {
    var checkedRoomIndex = checkedRoomNumber % 10;
    Array.prototype.forEach.call(adCapacity.children, function (element) {
      element.removeAttribute('selected', 'selected');
      element.setAttribute('disabled', 'disabled');
      if (element.value == checkedRoomIndex || element.value < checkedRoomIndex && element.value > 0) {
        element.removeAttribute('disabled', 'disabled');
        element.setAttribute('selected', 'selected');
      }
    });
  };

  setAvailibleCapacity();

  adRoomNumber.addEventListener('change', function (evt) {
    checkedRoomNumber = parseInt(evt.target.value, 10);
    setAvailibleCapacity();
  });

  var selectReset = function (nodeList) {
    Array.prototype.forEach.call(nodeList.children, function (element) {
      element.removeAttribute('selected', 'selected');
      element.removeAttribute('disabled', 'disabled');
    });
  };
  var resetButton = document.querySelector('button[type=reset]');
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.reset();
    window.mapActiveModeOff();
    window.fillAdress(window.MAIN_PIN_START_COORDS.X, window.MAIN_PIN_START_COORDS.Y);
    selectReset(adCheckOut);
    adPrice.removeAttribute('style', 'outline: 5px solid red');
    adTitle.removeAttribute('style', 'outline: 5px solid red');
  });
})();
