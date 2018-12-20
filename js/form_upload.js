'use strict';
(function () {

  var main = document.querySelector('main');
  var adForm = document.querySelector('.ad-form');
  adForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

  var URL = 'https://js.dump.academy/keksobooking';
  window.upload = function (data, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        errorFormUpload();
      }
    });
    xhr.open('POST', URL);
    xhr.send(data);
  };

  var onEscCloseSuccessMessage = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      main.removeChild(successMessage);
      document.removeEventListener('keydown', onEscCloseSuccessMessage);
    }
  };
  var onClickCloseSuccessMessage = function () {
    main.removeChild(successMessage);
    successMessage.removeEventListener('click', onClickCloseSuccessMessage);
    document.removeEventListener('keydown', onEscCloseSuccessMessage);
  };

  var onEscCloseErrorMessage = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      main.removeChild(errorMessage);
      document.removeEventListener('keydown', onEscCloseErrorMessage);
    }
  };
  var onClickCloseErrorMessage = function () {
    main.removeChild(errorMessage);
    errorMessage.removeEventListener('click', onClickCloseErrorMessage);
    document.removeEventListener('keydown', onEscCloseErrorMessage);
  };

  var errorMessage = document.querySelector('#error').content.querySelector('div');
  var errorFormUpload = function () {
    main.appendChild(errorMessage);
    var errorMessageCloseButton = document.querySelector('.error__button');
    document.addEventListener('keydown', onEscCloseErrorMessage);
    errorMessageCloseButton.addEventListener('click', onClickCloseErrorMessage);
  };

  var successMessage = document.querySelector('#success').content.querySelector('div');
  adForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(adForm), function () {
      main.appendChild(successMessage);
      document.addEventListener('keydown', onEscCloseSuccessMessage);
      successMessage.addEventListener('click', onClickCloseSuccessMessage);
      adForm.reset();
      window.mapActiveModeOff();
      window.fillAdress(window.MAIN_PIN_START_COORDS.X, window.MAIN_PIN_START_COORDS.Y);
    });
    evt.preventDefault();
  });
})();
