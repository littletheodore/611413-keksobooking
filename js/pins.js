'use strict';
(function () {
  var Icon = {
    width: 50,
    height: 70
  };

  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var fragment = document.createDocumentFragment();

  var drawing = function (array, pinQuantity) {
    var pins = document.querySelectorAll('button.map__pin');
    if (pins) {
      pins.forEach(function (element, index) {
        if (index !== window.map.MAIN_ICON_INDEX) {
          window.pins.mapPins.removeChild(element);
        }
      });
    }
    for (var i = 0; i < pinQuantity; i++) {
      var element = pinTemplate.cloneNode(true);
      element.style = 'left:' + (array[i].location.x - window.pins.Icon.width / 2) + 'px; ' + 'top:' + (array[i].location.y - window.pins.Icon.height) + 'px;';
      element.children[0].src = array[i].author.avatar;
      element.children[0].alt = array[i].offer.title;
      fragment.appendChild(element);
      window.pins.mapPins.appendChild(fragment);
    }
  };
  window.pins = {
    'mapPins': mapPins,
    'Icon': Icon,
    'drawing': drawing,
  };
})();
