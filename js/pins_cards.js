//pins_cards.js
'use strict';
(function () {
  //Отрисовка меток на карте
  var PIN = {
    width: 50,
    height: 70
  };
  window.PIN = PIN;
  var PIN_QUANTITY = 8;
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var fragment = document.createDocumentFragment();
  var pinDrawing = function (PIN_QUANTITY) {
    for (var i = 0; i < PIN_QUANTITY; i++) {
      var element = pinTemplate.cloneNode(true);
      element.style = 'left:' + (window.load.hosts[i].location.x - window.PIN.width / 2) + 'px; ' + 'top:' + (window.load.hosts[i].location.y - window.PIN.height) + 'px;';
      element.children[0].src = window.load.hosts[i].author.avatar;
      element.children[0].alt = window.load.hosts[i].offer.title;
      fragment.appendChild(element);
      mapPins.appendChild(fragment);
      window.mapPins = mapPins;
    }
  };
  window.pinDrawing = pinDrawing;

  //Заполнение карточки выбранной метки
  var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var TYPE_VARIANTS = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var fillMainCard = function (pinNumber) {
    var oldPopup = document.querySelector('article.popup');
    if (oldPopup) {
      map.removeChild(oldPopup);
    }
    var cardTemplate = document.querySelector('#card').content.querySelector('article');
    var mainCard = cardTemplate.cloneNode(true);
    mainCard.children[0].src = window.load.hosts[pinNumber].author.avatar;
    mainCard.children[2].textContent = window.load.hosts[pinNumber].offer.title;
    mainCard.children[3].textContent = window.load.hosts[pinNumber].offer.adress;
    mainCard.children[4].innerHTML = window.load.hosts[pinNumber].offer.price + '&#x20bd;<span>/ночь</span>';
    mainCard.children[5].textContent = TYPE_VARIANTS[window.load.hosts[pinNumber].offer.type];
    mainCard.children[6].textContent = window.load.hosts[pinNumber].offer.rooms + ' комнаты для ' + window.load.hosts[pinNumber].offer.guests + ' гостей';
    mainCard.children[7].textContent = 'Заезд после ' + window.load.hosts[pinNumber].offer.checkin + ', выезд до ' + window.load.hosts[pinNumber].offer.checkout;
    var featuresList = mainCard.children[8];
    var newFeaturesArray = [];
    for (var i = 0; i < FEATURES_VARIANTS.length; i++) {
      newFeaturesArray[i] = featuresList.children[0];
      featuresList.removeChild(featuresList.children[0]);
    }
    for (var i = 0; i < (window.load.hosts[pinNumber].offer.features.length); i++) {
      var feature = window.load.hosts[pinNumber].offer.features[i];
      newFeaturesArray.forEach(function (element) {
        var icon = element.classList;
        if (icon[1] === 'popup__feature--' + feature) {
          featuresList.appendChild(element);
        }
      });
    }
    mainCard.children[9].textContent = window.load.hosts[pinNumber].offer.description;
    var popupPhotos = mainCard.children[10];
    popupPhotos.children[0].src = window.load.hosts[pinNumber].offer.photos[0];
    for (var i = 1; i < (window.load.hosts[pinNumber].offer.photos.length); i++) {
      var newPhoto = popupPhotos.children[0].cloneNode(true);
      newPhoto.src = window.load.hosts[pinNumber].offer.photos[i];
      popupPhotos.appendChild(newPhoto);
    }
    window.map.insertBefore(mainCard, map.children[1]);
    window.mainCard = mainCard;
  };


  //Заполнение карточки выбранной метки по клику

  var DISABLE_ELEMENTS_QUANTITY = 2;
  var onPinClickOpenPopup = function (evt) {
    var target = event.target;
    if (!(target.type === 'button')) {
      target = target.parentElement;
    }
    Array.prototype.forEach.call(mapPins.children, function (element, index) {
      if ((element === target) && (index > 1)) {
        fillMainCard(index - DISABLE_ELEMENTS_QUANTITY);
        closePopup();
      }
    });
  };

  mapPins.addEventListener('click', onPinClickOpenPopup);

  //Закрытие popup по клику и по ESC
  window.ESC_KEYCODE = 27;
  var closePopup = function () {
    var onPopupCloseClick = document.querySelector('.popup__close');
    var onClickClosePopup = function (evt) {
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
})();
