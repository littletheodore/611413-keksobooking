'use strict';
(function () {
  var TYPE_MIN_PRICE = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };
  var adTitle = window.map.adForm.querySelector('#title');
  var adPrice = window.map.adForm.querySelector('#price');
  var adType = window.map.adForm.querySelector('#type');
  var adAvatar = window.map.adForm.querySelector('#avatar');
  var adAvatarPic = window.map.adForm.querySelector('.ad-form-header__preview > img');
  var checkedType = window.map.adForm.querySelector('#type>option:checked');
  var adCheckIn = window.map.adForm.querySelector('#timein');
  var adCheckOut = window.map.adForm.querySelector('#timeout');
  var adRoomNumber = window.map.adForm.querySelector('#room_number');
  var adCapacity = window.map.adForm.querySelector('#capacity');
  var adPhoto = window.map.adForm.querySelector('#images');
  var adPhotoPic = window.map.adForm.querySelector('.ad-form__photo');
  var checkedRoomNumber = window.map.adForm.querySelector('#room_number>option:checked').value;

  var selectReset = function (nodeList) {
    Array.prototype.forEach.call(nodeList.children, function (element) {
      element.selected = '';
      element.disabled = '';
    });
  };

  var previewImage = function (input, imgBox) {
    var picContainer = imgBox.parentElement;
    var FReader = new FileReader();
    var newBox = imgBox.cloneNode(true);
    FReader.readAsDataURL(input.files[0]);
    FReader.onload = function (event) {
      if (imgBox.tagName === 'IMG') {
        imgBox.src = event.target.result;
      } else {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(newBox);
        var newPic = document.createElement('img');
        newBox.appendChild(newPic);
        newPic.width = 70;
        newPic.height = 70;
        newPic.src = event.target.result;
        picContainer.appendChild(fragment);
      }
    };
  };

  adTitle.required = 'required';
  adTitle.minLength = '30';
  adTitle.maxLength = '100';
  adTitle.addEventListener('input', function () {
    if ((adTitle.value.length > adTitle.maxLength) || (adTitle.value.length < adTitle.minLength)) {
      adTitle.style = 'outline: 5px solid red';
    } else {
      adTitle.style = '';
    }
  });

  adAvatar.addEventListener('change', function () {
    previewImage(adAvatar, adAvatarPic);
  });

  adPhoto.addEventListener('change', function () {
    previewImage(adPhoto, adPhotoPic);
  });

  adPrice.required = 'required';
  adPrice.type = 'number';
  adPrice.max = 1000000;
  adPrice.min = TYPE_MIN_PRICE[checkedType.value];
  adPrice.placeholder = TYPE_MIN_PRICE[checkedType.value];
  adType.addEventListener('change', function (evt) {
    checkedType = evt.target.value;
    adPrice.min = TYPE_MIN_PRICE[checkedType];
    adPrice.placeholder = TYPE_MIN_PRICE[checkedType];
  });

  adPrice.addEventListener('input', function () {
    var inputValue = parseFloat(adPrice.value);
    if ((inputValue < adPrice.min) || (inputValue > adPrice.max)) {
      adPrice.style = 'outline: 5px solid red';
    } else {
      adPrice.style = '';
    }
  });

  var checkInOutTimeSet = function (input, evt) {
    selectReset(input);
    var checkedTime = parseFloat(evt.target.value);
    Array.prototype.forEach.call(input.children, function (element) {
      if (parseFloat(element.value) === checkedTime) {
        element.selected = 'selected';
      } else {
        element.selected = '';
      }
    });
  };

  adCheckIn.addEventListener('change', function (evt) {
    checkInOutTimeSet(adCheckOut, evt);
  });

  adCheckOut.addEventListener('change', function (evt) {
    checkInOutTimeSet(adCheckIn, evt);
  });


  var setAvailibleCapacity = function () {
    var checkedRoomIndex = checkedRoomNumber % 10;
    Array.prototype.forEach.call(adCapacity.children, function (element) {
      element.selected = '';
      element.disabled = 'disabled';
      if (+element.value === checkedRoomIndex || element.value < checkedRoomIndex && element.value > 0) {
        element.disabled = '';
        element.selected = 'selected';
      }
    });
  };

  setAvailibleCapacity();

  adRoomNumber.addEventListener('change', function (evt) {
    checkedRoomNumber = parseInt(evt.target.value, 10);
    setAvailibleCapacity();
  });


  var resetButton = document.querySelector('button[type=reset]');
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.map.adForm.reset();
    selectReset(adCheckOut);
    adPrice.style = '';
    adTitle.style = '';
    window.map.activeModeOff();
    window.map.fillAdress(window.map.MAIN_PIN_START_COORDS.X, window.map.MAIN_PIN_START_COORDS.Y);

  });
})();
