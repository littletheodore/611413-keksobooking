'use strict';
(function () {
  window.ESC_KEYCODE = 27;
  var PIN = {
    width: 50,
    height: 70
  };
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var fragment = document.createDocumentFragment();
  var pinDrawing = function (array, PIN_QUANTITY) {
    var pins = document.querySelectorAll('button.map__pin');
    if (pins) {
      pins.forEach(function (element, index) {
        if (index !== window.map.MAIN_ICON_INDEX) {
          mapPins.removeChild(element);
        }
      });
    }
    for (var i = 0; i < PIN_QUANTITY; i++) {
      var element = pinTemplate.cloneNode(true);
      element.style = 'left:' + (array[i].location.x - window.pinsCards.PIN.width / 2) + 'px; ' + 'top:' + (array[i].location.y - window.pinsCards.PIN.height) + 'px;';
      element.children[0].src = array[i].author.avatar;
      element.children[0].alt = array[i].offer.title;
      fragment.appendChild(element);
      mapPins.appendChild(fragment);
    }
  };
  var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TYPE_VARIANTS = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var fillMainCard = function (array, pinNumber) {
    var oldPopup = document.querySelector('article.popup');
    if (oldPopup) {
      window.map.map.removeChild(oldPopup);
    }
    var cardTemplate = document.querySelector('#card').content.querySelector('article');
    var mainCard = cardTemplate.cloneNode(true);
    mainCard.children[0].src = array[pinNumber].author.avatar;
    mainCard.children[2].textContent = array[pinNumber].offer.title;
    mainCard.children[3].textContent = array[pinNumber].offer.adress;
    mainCard.children[4].innerHTML = array[pinNumber].offer.price + '&#x20bd;<span>/ночь</span>';
    mainCard.children[5].textContent = TYPE_VARIANTS[array[pinNumber].offer.type];
    mainCard.children[6].textContent = array[pinNumber].offer.rooms + ' комнаты для ' + array[pinNumber].offer.guests + ' гостей';
    mainCard.children[7].textContent = 'Заезд после ' + array[pinNumber].offer.checkin + ', выезд до ' + array[pinNumber].offer.checkout;
    var featuresList = mainCard.children[8];
    var newFeaturesArray = [];
    for (var i = 0; i < FEATURES_VARIANTS.length; i++) {
      newFeaturesArray[i] = featuresList.children[0];
      featuresList.removeChild(featuresList.children[0]);
    }

    array[pinNumber].offer.features.forEach(function (element) {
      var feature = element;
      newFeaturesArray.forEach(function (param) {
        var icon = param.classList;
        if (icon[1] === 'popup__feature--' + feature) {
          featuresList.appendChild(param);
        }
      });
    });

    mainCard.children[9].textContent = array[pinNumber].offer.description;

    if (array[pinNumber].offer.photos.length !== 0) {
      var popupPhotos = mainCard.children[10];
      popupPhotos.children[0].src = array[pinNumber].offer.photos[0];
      array[pinNumber].offer.photos.forEach(function (element, index) {
        if (index > 0) {
          var newPhoto = popupPhotos.children[0].cloneNode(true);
          newPhoto.src = element;
          popupPhotos.appendChild(newPhoto);
        }
      });
    } else {
      mainCard.removeChild(mainCard.children[10]);
    }
    window.map.map.insertBefore(mainCard, window.map.map.children[1]);
    window.mainCard = mainCard;
  };

  var popupAppear = function (array) {
    var DISABLE_ELEMENTS_QUANTITY = 2;
    var onPinClickOpenPopup = function (evt) {
      var target = evt.target;
      if (!(target.type === 'button')) {
        target = target.parentElement;
      }
      Array.prototype.forEach.call(mapPins.children, function (element, index) {
        if ((element === target) && (index > 1)) {
          fillMainCard(array, index - DISABLE_ELEMENTS_QUANTITY);
          closePopup();
        }
      });
    };
    mapPins.addEventListener('click', onPinClickOpenPopup);

    var closePopup = function () {
      var onPopupCloseClick = document.querySelector('.popup__close');
      var onClickClosePopup = function () {
        window.mainCard.classList.add('hidden');
        document.removeEventListener('keydown', onEscClosePopup);
      };
      var onEscClosePopup = function (evt) {
        if (evt.keyCode === window.ESC_KEYCODE) {
          window.mainCard.classList.add('hidden');
          document.removeEventListener('keydown', onEscClosePopup);
        }
      };
      onPopupCloseClick.setAttribute('tabindex', '0');
      onPopupCloseClick.addEventListener('click', onClickClosePopup);
      document.addEventListener('keydown', onEscClosePopup);
    };

  };

  window.pinsCards = {
    'PIN': PIN,
    'pinDrawing': pinDrawing,
    'popupAppear': popupAppear
  };
})();
