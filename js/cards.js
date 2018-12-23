'use strict';
(function () {
  window.ESC_KEYCODE = 27;

  var FeatureVariant = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TypeVariant = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };


  var fillMainCard = function (array, pinNumber) {
    var oldPopup = document.querySelector('article.popup');
    if (oldPopup) {
      window.map.section.removeChild(oldPopup);
    }
    var cardTemplate = document.querySelector('#card').content.querySelector('article');
    var mainCard = cardTemplate.cloneNode(true);
    mainCard.children[0].src = array[pinNumber].author.avatar;
    mainCard.children[2].textContent = array[pinNumber].offer.title;
    mainCard.children[3].textContent = array[pinNumber].offer.adress;
    mainCard.children[4].textContent = array[pinNumber].offer.price + ' руб/ночь';
    mainCard.children[5].textContent = TypeVariant[array[pinNumber].offer.type];
    mainCard.children[6].textContent = array[pinNumber].offer.rooms + ' комнаты для ' + array[pinNumber].offer.guests + ' гостей';
    mainCard.children[7].textContent = 'Заезд после ' + array[pinNumber].offer.checkin + ', выезд до ' + array[pinNumber].offer.checkout;
    var featuresList = mainCard.children[8];
    var newFeaturesArray = [];
    for (var i = 0; i < FeatureVariant.length; i++) {
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
    window.map.section.insertBefore(mainCard, window.map.section.children[1]);
    window.mainCard = mainCard;
  };

  var popupAppear = function (array) {
    var DISABLE_ELEMENTS_QUANTITY = 2;
    var onPinClickOpenPopup = function (evt) {
      var target = evt.target;
      if (!(target.type === 'button')) {
        target = target.parentElement;
      }
      target.classList.add('map__pin--active');
      Array.prototype.forEach.call(window.pins.mapPins.children, function (element, index) {
        if ((element === target) && (index > 1)) {
          fillMainCard(array, index - DISABLE_ELEMENTS_QUANTITY);
          closePopup();
        } else {
          element.classList.remove('map__pin--active');
        }
      });
    };
    window.pins.mapPins.addEventListener('click', onPinClickOpenPopup);

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
      onPopupCloseClick.tabindex = 0;
      onPopupCloseClick.addEventListener('click', onClickClosePopup);
      document.addEventListener('keydown', onEscClosePopup);
    };

  };

  window.cards = {
    'popupAppear': popupAppear
  };
})();
