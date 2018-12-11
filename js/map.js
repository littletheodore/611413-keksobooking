'use strict';

var hosts = [];
//var TITLE_VARIANTS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало недалеко от моря', 'Неуютное бунгало по колено в воде'];
//var CHECK_TIME_VARIANTS = ['12:00', '13:00', '14:00'];
var TYPE_VARIANTS = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var TYPE_MIN_PRICE = {
  'palace': 10000,
  'flat': 1000,
  'house': 5000,
  'bungalo': 0
};
var FEATURES_VARIANTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MAP_FIELD = {
  width: {
    min: 300,
    max: 900
  },
  height: {
    min: 130,
    max: 630
  },
};
var PRICE_VARIANTS = {
  min: 1000,
  max: 1000000
};
var ROOMS_VARIANTS = {
  min: 1,
  max: 5
};
var GUESTS_VARIANTS = {
  min: 1,
  max: 10
};
var PIN = {
  width: 50,
  height: 70
};
var PIN_QUANTITY = 8;
var ESC_KEYCODE = 27;

var randomNumber = function (max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomArray = function (variants) {
  var newArray = [];
  for (var i = 0; i < randomNumber(variants.length, 0); i++) {
    newArray[i] = variants[randomNumber((variants.length - 1), 0)];
    for (var j = 0; j < i; j++) {
      if (newArray[i] === newArray[j]) {
        newArray[i] = '';
        i = i - 1;
      }
    }
  }
  return newArray;
};

var randomObjectKey = function (obj) {
  var keys = Object.keys(obj);
  return keys[keys.length * Math.random() << 0];
};

//Загрузка данных об объектах
var DATAURL = 'https://js.dump.academy/keksobooking/data';
window.load = function (onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', DATAURL);
  xhr.addEventListener('load', function () {
    onSuccess(xhr.response);
  });
  xhr.send();
};

window.load(function (newHosts) {
  for (var i = 0; i < newHosts.length; i++) {
    hosts[i] = newHosts[i];
  }
});


var map = document.querySelector('.map');

//Отрисовка меток на карте
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var fragment = document.createDocumentFragment();
var pinDrawing = function (PIN_QUANTITY) {
  for (var i = 0; i < PIN_QUANTITY; i++) {
    var element = pinTemplate.cloneNode(true);
    element.style = 'left:' + (hosts[i].location.x - PIN.width / 2) + 'px; ' + 'top:' + (hosts[i].location.y - PIN.height) + 'px;';
    element.children[0].src = hosts[i].author.avatar;
    element.children[0].alt = hosts[i].offer.title;
    fragment.appendChild(element);
    mapPins.appendChild(fragment);
  }
};
//Заполнение карточки выбранной метки

var fillMainCard = function (pinNumber) {

  var oldPopup = document.querySelector('article.popup');
  if (oldPopup) {
    map.removeChild(oldPopup);
  }

  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var mainCard = cardTemplate.cloneNode(true);

  mainCard.children[0].src = hosts[pinNumber].author.avatar;
  mainCard.children[2].textContent = hosts[pinNumber].offer.title;
  mainCard.children[3].textContent = hosts[pinNumber].offer.adress;
  mainCard.children[4].innerHTML = hosts[pinNumber].offer.price + '&#x20bd;<span>/ночь</span>';

  mainCard.children[5].textContent = TYPE_VARIANTS[hosts[pinNumber].offer.type];

  mainCard.children[6].textContent = hosts[pinNumber].offer.rooms + ' комнаты для ' + hosts[pinNumber].offer.guests + ' гостей';
  mainCard.children[7].textContent = 'Заезд после ' + hosts[pinNumber].offer.checkin + ', выезд до ' + hosts[pinNumber].offer.checkout;

  var featuresList = mainCard.children[8];
  var newFeaturesArray = [];
  for (var i = 0; i < FEATURES_VARIANTS.length; i++) {
    newFeaturesArray[i] = featuresList.children[0];
    featuresList.removeChild(featuresList.children[0]);
  }

  for (var i = 0; i < (hosts[pinNumber].offer.features.length); i++) {
    var feature = hosts[pinNumber].offer.features[i];
    newFeaturesArray.forEach(function (element) {
      var icon = element.classList;
      if (icon[1] === 'popup__feature--' + feature) {
        featuresList.appendChild(element);
      }
    });
  }

  mainCard.children[9].textContent = hosts[pinNumber].offer.description;

  var popupPhotos = mainCard.children[10];
  popupPhotos.children[0].src = hosts[pinNumber].offer.photos[0];
  for (var i = 1; i < (hosts[pinNumber].offer.photos.length); i++) {
    var newPhoto = popupPhotos.children[0].cloneNode(true);
    newPhoto.src = hosts[pinNumber].offer.photos[i];
    popupPhotos.appendChild(newPhoto);
  }
  map.insertBefore(mainCard, map.children[1]);

  window.mainCard = mainCard;

  var onPinCloseClick = document.querySelector('.popup__close');
  onPinCloseClick.setAttribute('tabindex', '0');
  onPinCloseClick.addEventListener('click', onClickClosePopup);
  document.addEventListener('keydown', onEscClosePopup);
};

//Закрытие popup по клику и по ESC

var onClickClosePopup = function (evt) {
  window.mainCard.classList.add('hidden');
  document.removeEventListener('keydown', onEscClosePopup);
};

var onEscClosePopup = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    window.mainCard.classList.add('hidden');
    document.removeEventListener('keydown', onEscClosePopup);
  }
};

//Активное-неактивное состояние форм
var noticeFieldsets = document.querySelectorAll('.ad-form>fieldset');
var mapFiltersForm = document.querySelector('.map__filters');
var noticeForm = document.querySelector('.ad-form');
var MAIN_ICON_INDEX = 0;


//Переход в неактивное состояние форм
var activeModeOff = function () {
  noticeFieldsets.forEach(function (element) {
    element.disabled = 'disabled';
  });
  mapFiltersForm.classList.add('map__filters--disabled');
  if (!map.classList.contains('map--faded')) {
    map.classList.add('map--faded');
  }
  if (!noticeForm.classList.contains('ad-form--disabled')) {
    noticeForm.classList.add('ad-form--disabled');
  }
  var popup = document.querySelector('article.popup');
  if (popup) {
    map.removeChild(popup);
  }
  var pins = document.querySelectorAll('button.map__pin');
  pins.forEach(function (element, index) {
    if (index !== MAIN_ICON_INDEX) {
      mapPins.removeChild(element);
    }
  });
};

activeModeOff();

//Заполнение поля адрес
var MAIN_ICON_SIZE = 65;
var halfMainIconSize = MAIN_ICON_SIZE / 2;
var fillAdress = function (iconX, iconY) {
  var adressInput = document.querySelector('#address');
  adressInput.setAttribute('value', Math.round(iconX + halfMainIconSize) + ',' + Math.round(iconY + halfMainIconSize));
  adressInput.setAttribute('readonly', 'readonly');
};


//Переход в активное состояние по клику на основную иконку
var activeModeOn = function () {
  map.classList.remove('map--faded');
  mapFiltersForm.classList.remove('map__filters--disabled');
  pinDrawing(8);
  noticeForm.classList.remove('ad-form--disabled');
  noticeFieldsets.forEach(function (element) {
    element.disabled = '';
  });
};

var onMainPinClick = document.querySelector('.map__pin--main');
onMainPinClick.addEventListener('mouseup', function () {
  activeModeOn();
  fillAdress(parseFloat(onMainPinClick.style.left), parseFloat(onMainPinClick.style.top));
});

//Заполнение карточки выбранной метки по клику
var DISABLE_ELEMENTS_QUANTITY = 2;
mapPins.addEventListener('click', function (event) {
  var target = event.target;
  if (!(target.type === 'button')) {
    target = target.parentElement;
  }
  Array.prototype.forEach.call(mapPins.children, function (element, index) {
    if (element === target) {
      var pinIndex = (index < 2) ? 0 : (index - DISABLE_ELEMENTS_QUANTITY);
      fillMainCard(pinIndex);
    }
  });
});



//Валидация формы
//Заголовок объявления
var adTitle = document.querySelector('#title');
adTitle.setAttribute('required', 'required');
adTitle.setAttribute('minlength', '3');
adTitle.setAttribute('maxlength', '100');


//Цена за ночь
var adPrice = document.querySelector('#price');
var adType = document.querySelector('#type');
var checkedType = document.querySelector('#type>option:checked');

adPrice.setAttribute('required', 'required');
adPrice.setAttribute('type', 'number');
adPrice.setAttribute('max', '1000000');
adPrice.setAttribute('min', TYPE_MIN_PRICE[checkedType]);

adType.addEventListener('change', function (evt) {
  checkedType = evt.target.value;
  adPrice.setAttribute('min', TYPE_MIN_PRICE[checkedType]);
  adPrice.setAttribute('placeholder', TYPE_MIN_PRICE[checkedType]);
});

//Время заезда/выезда
var adCheckIn = document.querySelector('#timein');
var adCheckOut = document.querySelector('#timeout');
adCheckIn.addEventListener('change', function (evt) {
  var checkedTime = parseFloat(evt.target.value);
  Array.prototype.forEach.call(adCheckOut.children, function (element) {
    if (parseFloat(element.value) === checkedTime) {
      element.setAttribute('selected', 'selected');
    } else {
      element.setAttribute('disabled', 'disabled');
    }
  });
});

//Количество комнат/количество мест
var adRoomNumber = document.querySelector('#room_number');
var adCapacity = document.querySelector('#capacity');
var checkedRoomNumber = document.querySelector('#room_number>option:checked').value;
var setAvailibleCapacity = function () {
  var checkedRoomIndex = checkedRoomNumber % 10;
  Array.prototype.forEach.call(adCapacity.children, function (element) {
    element.removeAttribute('selected', 'selected');
    element.setAttribute('disabled', 'disabled');
    if (element.value == checkedRoomIndex || element.value < checkedRoomIndex && element.value > 0) {
      element.removeAttribute('disabled', 'disabled');
      element.setAttribute('selected', 'selected');
    }
  });
}

setAvailibleCapacity();

adRoomNumber.addEventListener('change', function (evt) {
  checkedRoomNumber = parseInt(evt.target.value);
  setAvailibleCapacity();
});

//Отправка формы
var main = document.querySelector('main');
var adForm = document.querySelector('.ad-form');
adForm.setAttribute('action', 'https://js.dump.academy/keksobooking');
noticeFieldsets.forEach(function (element) {
  element.addEventListener('invalid', function (evt) {
    element.setAttribute('style', 'outline: 5px solid red');
  });
});

//Закрытие сообщения об успешной отправке формы по клавише Esc и по клику
var onEscClose = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    main.removeChild(successMessage);
    document.removeEventListener('keydown', onEscClose);
  }
};
var onClickClose = function (evt) {
  main.removeChild(successMessage);
  successMessage.removeEventListener('click', onClickClose);
  document.removeEventListener('keydown', onEscClose);
};

//Сообщение об успешной отправке формы
var successMessage = document.querySelector('#success').content.querySelector('div');
adForm.addEventListener('submit', function (evt) {
  window.upload(new FormData(adForm), function (response) {
    main.appendChild(successMessage);
    document.addEventListener('keydown', onEscClose);
    successMessage.addEventListener('click', onClickClose);
    adForm.reset();
    activeModeOff();
    fillAdress(parseFloat(onMainPinClick.style.left), parseFloat(onMainPinClick.style.top));
  });
  evt.preventDefault();
});

//Отправка формы
var URL = 'https://js.dump.academy/keksobooking';
window.upload = function (data, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      onSuccess(xhr.response);
    } else {
      onError(xhr.status);
    };
  });
  xhr.open('POST', URL);
  xhr.send(data);
};




//Очистка формы по нажатию на reset
var resetButton = document.querySelector('button[type=reset]');
resetButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  adForm.reset();
  activeModeOff();
  fillAdress(parseFloat(onMainPinClick.style.left), parseFloat(onMainPinClick.style.top));
});
