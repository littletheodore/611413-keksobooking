//form_upload.js
'use strict';
(function () {

  //Отправка формы
  var main = document.querySelector('main');
  var adForm = document.querySelector('.ad-form');
  adForm.setAttribute('action', 'https://js.dump.academy/keksobooking');

  //Отправка формы
  var URL = 'https://js.dump.academy/keksobooking';
  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError()
      };
    });
    xhr.open('POST', URL);
    xhr.send(data);
  };


  //Закрытие сообщения об успешной отправке формы по клавише Esc и по клику
  var onEscCloseMessage = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      main.removeChild(successMessage);
      document.removeEventListener('keydown', onEscCloseMessage);
    }
  };
  var onClickCloseMessage = function (evt) {
    main.removeChild(successMessage);
    successMessage.removeEventListener('click', onClickCloseMessage);
    document.removeEventListener('keydown', onEscCloseMessage);
  };

  //Сообщение об успешной отправке формы
  var successMessage = document.querySelector('#success').content.querySelector('div');
  adForm.addEventListener('submit', function (evt) {
    window.upload(new FormData(adForm), function (response) {
      main.appendChild(successMessage);
      document.addEventListener('keydown', onEscCloseMessage);
      successMessage.addEventListener('click', onClickCloseMessage);
      adForm.reset();
      window.mapActiveModeOff();
      window.fillAdress(window.MAIN_PIN_START_COORDS.X, window.MAIN_PIN_START_COORDS.Y);
    });
    evt.preventDefault();
  });


})();
