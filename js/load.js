'use strict';

(function () {
  var GETDATAURL = 'https:js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;

  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === window.StatusCode.Success) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа' + xhr.status);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      if (xhr.timeout > TIMEOUT) {
        onError('Сервер не отвечает в течение' + xhr.timeout + 'мс');
      }
    });
    xhr.open('GET', GETDATAURL);
    xhr.send();
  };
  window.StatusCode = {
    'Success': 200,
    'Response redirection': 300,
    'Response error': 400,
    'Server error': 500
  };
})();
