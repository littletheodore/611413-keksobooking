'use strict';

(function () {
  //Загрузка данных об объектах
  var hosts = [];
  var GETDATAURL = 'https://js.dump.academy/keksobooking/data';
  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', GETDATAURL);
    xhr.addEventListener('load', function () {
      onSuccess(xhr.response);
    });
    xhr.send();
  };

  window.load(function (newHosts) {
    for (var i = 0; i < newHosts.length; i++) {
      hosts[i] = newHosts[i];
    }
    window.load.hosts = hosts;
  });
})();
