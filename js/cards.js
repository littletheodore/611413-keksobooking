'use strict';
(function () {
  window.ESC_KEYCODE = 27;

  var TypeVariant = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var DISABLE_ELEMENTS_QUANTITY = 2;

  var featureSet = function (field, checkedFeatures) {
    Array.prototype.forEach.call(field.children, function (feature) {
      var isFeature = false;
      checkedFeatures.forEach(function (element) {
        if (feature.classList.contains('popup__feature--' + element)) {
          isFeature = true;
        }
      });
      if (!isFeature) {
        feature.style = 'display:none';
      }
    });
  };

  var fillMainCard = function (checkedPin) {
    var oldPopup = document.querySelector('article.popup');
    if (oldPopup) {
      window.map.section.removeChild(oldPopup);
    }
    var cardTemplate = document.querySelector('#card').content.querySelector('article');
    var mainCard = cardTemplate.cloneNode(true);
    var cardFields = {
      'title': checkedPin.offer.title,
      'text--address': checkedPin.offer.address,
      'text--price': checkedPin.offer.price + ' руб/ночь',
      'type': TypeVariant[checkedPin.offer.type],
      'text--capacity': checkedPin.offer.rooms + ' комнаты для ' + checkedPin.offer.guests + ' гостей',
      'text--time': 'Заезд после ' + checkedPin.offer.checkin + ', выезд до ' + checkedPin.offer.checkout,
      'description': checkedPin.offer.description
    };
    Array.prototype.forEach.call(mainCard.children, function (field) {
      for (var key in cardFields) {
        if (field.classList.contains('popup__' + key)) {
          field.textContent = cardFields[key];
        }
      }
      if (field.classList.contains('popup__avatar')) {
        field.src = checkedPin.author.avatar;
      }

      if (field.classList.contains('popup__features')) {
        featureSet(field, checkedPin.offer.features);
      }
      if (field.classList.contains('popup__photos')) {
        checkedPin.offer.photos.forEach(function (element) {
          var newPhoto = field.children[0].cloneNode(true);
          newPhoto.src = element;
          field.appendChild(newPhoto);
        });
        field.children[0].style = 'display:none';
      }
    });

    window.map.section.insertBefore(mainCard, window.map.section.children[1]);
    window.mainCard = mainCard;
  };

  var popupAppear = function (array) {
    var onPinClickOpenPopup = function (evt) {
      var target = evt.target;
      if (target.tagName === 'IMG') {
        target = target.parentElement;
      }
      target.classList.add('map__pin--active');
      Array.prototype.forEach.call(window.pins.mapIcons.children, function (element, index) {
        if ((element === target) && (index > 1)) {
          fillMainCard(array[index - DISABLE_ELEMENTS_QUANTITY]);
          closePopup();
        } else {
          element.classList.remove('map__pin--active');
        }
      });
    };
    window.pins.mapIcons.addEventListener('click', onPinClickOpenPopup);

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
